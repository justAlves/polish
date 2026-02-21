import { useToast } from "@/components/molecules/toast";
import UnstableSiriOrb from "@/components/organisms/unstable_siri_orb";
import { useSendMessage } from "@/hooks/use-chat";
import { Feather } from "@expo/vector-icons";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { File, Paths } from "expo-file-system";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Animated, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NOISE_OFFSET_DB = 10;
const MIN_SPEECH_DURATION_MS = 350; // debounce inicial: tempo mínimo para confirmar que começou a falar
const SILENCE_DURATION_MS = 2500; // aumentado: dá mais margem para pausas naturais na fala
const CALIBRATION_DURATION_MS = 1800;

type Phase = "idle" | "calibrating" | "listening" | "speaking" | "processing";

function VoiceBars() {
  const anims = useRef(
    [0, 1, 2, 3, 4].map(() => new Animated.Value(0.3)),
  ).current;

  useEffect(() => {
    const loops = anims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 90),
          Animated.timing(anim, {
            toValue: 1,
            duration: 220 + i * 40,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.2,
            duration: 220 + i * 40,
            useNativeDriver: true,
          }),
          Animated.delay((4 - i) * 70),
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, []);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 16,
        height: 20,
      }}
    >
      {anims.map((anim, i) => (
        <Animated.View
          key={i}
          style={{
            width: 5,
            height: 20,
            borderRadius: 3,
            backgroundColor: "#818cf8",
            transform: [{ scaleY: anim }],
          }}
        />
      ))}
    </View>
  );
}

function ChaseDots({ color, count = 3 }: { color: string; count?: number }) {
  const anims = useRef(
    Array.from({ length: count }, () => new Animated.Value(0.2)),
  ).current;

  useEffect(() => {
    const loops = anims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 160),
          Animated.timing(anim, {
            toValue: 1,
            duration: 320,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.2,
            duration: 320,
            useNativeDriver: true,
          }),
          Animated.delay((count - 1 - i) * 160),
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, []);

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 6,
        marginTop: 16,
        alignItems: "center",
      }}
    >
      {anims.map((anim, i) => (
        <Animated.View
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: 4,
            backgroundColor: color,
            opacity: anim,
          }}
        />
      ))}
    </View>
  );
}

export default function ConversationScreen() {
  const { id } = useLocalSearchParams();

  const audioRecorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });
  const recorderState = useAudioRecorderState(audioRecorder, 80);

  const player = useAudioPlayer(null);
  const playerStatus = useAudioPlayerStatus(player);
  const isPlaying = playerStatus.playing;

  const toast = useToast();
  const { mutate: sendAudio } = useSendMessage();

  const [phase, setPhase] = useState<Phase>("idle");
  const [responseText, setResponseText] = useState("");
  const phaseRef = useRef<Phase>("idle");

  const thresholdRef = useRef(-35);
  const calibReadingsRef = useRef<number[]>([]);
  const calibTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speechStartRef = useRef<number | null>(null);
  const hasSpokeRef = useRef(false);
  const wasPlayingRef = useRef(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  const updatePhase = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const stopAndSendRef = useRef<(() => Promise<void>) | undefined>(undefined);
  const startListeningRef = useRef<(() => Promise<void>) | undefined>(
    undefined,
  );
  const startCalibratingRef = useRef<(() => Promise<void>) | undefined>(
    undefined,
  );

  const startListening = useCallback(async () => {
    hasSpokeRef.current = false;
    speechStartRef.current = null;
    clearSilenceTimer();
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    updatePhase("listening");
  }, [audioRecorder]);

  const stopAndSend = useCallback(async () => {
    clearSilenceTimer();
    await audioRecorder.stop();
    const audio = audioRecorder.uri;

    if (!audio) {
      updatePhase("idle");
      return;
    }

    updatePhase("processing");
    sendAudio(
      {
        uri: audio,
        id: id as string,
      },
      {
        onSuccess: (data) => {
          setResponseText(data.text);
          const file = new File(Paths.cache, "response.mp3");
          file.write(data.audio, { encoding: "base64" });
          player.replace({ uri: file.uri });
          player.play();
        },
        onError: (error) => {
          console.error(
            "Error:",
            (error as any).response?.data || error.message,
          );
          toast.show("Erro ao enviar mensagem", {
            type: "error",
            position: "top",
          });
          startListeningRef.current?.();
        },
      },
    );
  }, [audioRecorder, sendAudio, player, toast]);

  const startCalibrating = useCallback(async () => {
    calibReadingsRef.current = [];
    setResponseText("");
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    updatePhase("calibrating");

    calibTimerRef.current = setTimeout(async () => {
      // Calcula ruído ambiente pelo 90th percentil das leituras
      const readings = calibReadingsRef.current.filter((v) => v > -160);
      if (readings.length > 0) {
        readings.sort((a, b) => a - b);
        const noiseFloor = readings[Math.floor(readings.length * 0.9)] ?? -60;
        const raw = noiseFloor + NOISE_OFFSET_DB;
        // Mín -45 dBFS (sensível em silêncio), máx -18 dBFS (ruído muito alto)
        thresholdRef.current = Math.max(-45, Math.min(-18, raw));
      }

      // Para a gravação de calibração antes de iniciar nova sessão
      await audioRecorder.stop();
      startListeningRef.current?.();
    }, CALIBRATION_DURATION_MS);
  }, [audioRecorder]);

  stopAndSendRef.current = stopAndSend;
  startListeningRef.current = startListening;
  startCalibratingRef.current = startCalibrating;

  // Setup inicial
  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permissão negada", "Acesso ao microfone é necessário.");
        return;
      }
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
      startCalibratingRef.current?.();
    })();

    return () => {
      clearSilenceTimer();
      if (calibTimerRef.current) clearTimeout(calibTimerRef.current);
    };
  }, []);

  // VAD + coleta durante calibração
  useEffect(() => {
    const p = phaseRef.current;
    const metering = recorderState.metering ?? -160;

    if (p === "calibrating") {
      if (metering > -160) calibReadingsRef.current.push(metering);
      return;
    }

    if ((p !== "listening" && p !== "speaking") || !recorderState.isRecording)
      return;

    const threshold = thresholdRef.current;

    if (metering > threshold) {
      // Fala detectada: cancela o timer de silêncio
      clearSilenceTimer();

      if (hasSpokeRef.current) {
        // Já confirmado falando antes: retomada após pausa — sem debounce
        if (p !== "speaking") updatePhase("speaking");
      } else {
        // Primeira detecção: aplica debounce para evitar falsos positivos
        if (speechStartRef.current === null) {
          speechStartRef.current = Date.now();
        } else if (
          Date.now() - speechStartRef.current >=
          MIN_SPEECH_DURATION_MS
        ) {
          hasSpokeRef.current = true;
          updatePhase("speaking");
        }
      }
    } else {
      if (!hasSpokeRef.current) {
        // Ainda não confirmou fala: reseta o debounce
        speechStartRef.current = null;
      } else if (!silenceTimerRef.current) {
        // Estava falando, agora silêncio: inicia o timer para encerrar
        if (p === "speaking") updatePhase("listening");
        silenceTimerRef.current = setTimeout(() => {
          silenceTimerRef.current = null;
          stopAndSendRef.current?.();
        }, SILENCE_DURATION_MS);
      }
    }
  }, [recorderState.metering]);

  // Recalibra após reprodução terminar
  useEffect(() => {
    if (isPlaying) {
      wasPlayingRef.current = true;
    } else if (wasPlayingRef.current) {
      wasPlayingRef.current = false;
      const t = setTimeout(() => startCalibratingRef.current?.(), 400);
      return () => clearTimeout(t);
    }
  }, [isPlaying]);

  // Animação de pulso
  useEffect(() => {
    if (phase === "listening") {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.18,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      );
      pulseLoop.current.start();
    } else {
      pulseLoop.current?.stop();
      pulseAnim.setValue(1);
    }
  }, [phase]);

  const orbProps = {
    speed: phase === "speaking" ? 2.5 : isPlaying ? 2 : 1,
    noiseIntensity: phase === "speaking" ? 2.5 : isPlaying ? 2 : 1,
    coreIntensity: phase === "speaking" ? 1 : isPlaying ? 1 : 0.5,
    glowIntensity: phase === "speaking" ? 3.5 : isPlaying ? 3 : 1.5,
  };

  const statusText =
    phase === "calibrating"
      ? "Ajustando ao ambiente..."
      : phase === "speaking"
        ? "Te ouvindo..."
        : phase === "processing"
          ? isPlaying
            ? "Reproduzindo..."
            : "Processando..."
          : phase === "listening"
            ? "Aguardando você falar"
            : "Iniciando...";

  return (
    <View className="flex-1 bg-neutral-950">
      <SafeAreaView edges={["top"]}>
        <View className="px-8 pt-4 pb-2 flex-row items-center gap-4">
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </Pressable>
          <View>
            <Text className="text-white font-space-mono text-2xl font-bold">
              Conversar
            </Text>
            <Text className="text-neutral-400 mt-0.5 text-sm">
              Pratique seu idioma com a IA
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <View className="flex-1 justify-center items-center">
        {(phase === "listening" || phase === "speaking") && (
          <Animated.View
            style={{
              position: "absolute",
              width: 320,
              height: 320,
              borderRadius: 160,
              backgroundColor: phase === "speaking" ? "#6366f1" : "#4f46e5",
              opacity: phase === "speaking" ? 0.18 : 0.08,
              transform: [{ scale: pulseAnim }],
            }}
          />
        )}

        <UnstableSiriOrb {...orbProps} />

        <Text className="text-neutral-500 text-sm font-space-mono mt-6">
          {statusText}
        </Text>

        {phase === "calibrating" && <ChaseDots color="#404040" count={5} />}

        {phase === "speaking" && <VoiceBars />}

        {phase === "processing" && !isPlaying && (
          <ChaseDots color="#7c3aed" count={3} />
        )}

        {isPlaying && responseText !== "" && (
          <View className="mx-8 mt-8 bg-neutral-900 border border-neutral-800 rounded-2xl px-5 py-4">
            <Text className="text-white text-base text-center leading-6">
              {responseText}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
