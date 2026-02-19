import { Button } from "@/components/base/button";
import { useToast } from "@/components/molecules/toast";
import UnstableSiriOrb from "@/components/organisms/unstable_siri_orb";
import { useSendMessage } from "@/hooks/use-chat";
import { Feather as Icon } from "@expo/vector-icons";
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
import { useEffect } from "react";
import { Alert, Text, View } from "react-native";

export default function Chat() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const player = useAudioPlayer(null);
  const playerStatus = useAudioPlayerStatus(player);
  const isPlaying = playerStatus.playing;

  const toast = useToast();
  const { mutate: sendAudio, isPending } = useSendMessage();

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopRecording = async () => {
    await audioRecorder.stop();

    const audio = audioRecorder.uri;

    if (!audio) {
      return;
    }

    sendAudio(audio, {
      onSuccess: (data) => {
        console.log("Message response:", data);
        const file = new File(Paths.cache, "response.mp3");
        file.write(data.audio, { encoding: "base64" });
        player.replace({ uri: file.uri });
        player.play();
      },
      onError: (error) => {
        console.error(
          "Error sending message:",
          error.response?.data || error.message,
        );
        toast.show("Failed to send message", {
          type: "error",
          position: "top",
        });
      },
    });
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  return (
    <View className="flex-1 bg-neutral-950 justify-center items-center">
      <UnstableSiriOrb
        speed={isPlaying ? 2 : 1}
        noiseIntensity={isPlaying ? 2 : 1}
        coreIntensity={isPlaying ? 1 : 0.5}
        glowIntensity={isPlaying ? 3 : 1.5}
      />
      <Button
        width={250}
        height={52}
        backgroundColor="transparent"
        isLoading={isPending}
        loadingText="Aguardando resposta"
        loadingTextBackgroundColor="transparent"
        gradientColors={
          recorderState.isRecording
            ? ["#ef4444", "#dc2626", "#b91c1c"]
            : ["#6366f1", "#8b5cf6", "#a78bfa"]
        }
        onPressIn={record}
        onPressOut={stopRecording}
      >
        <View className="flex-row items-center">
          <Text className="text-white text-base font-semibold">
            {isPending
              ? "Aguardando resposta"
              : recorderState.isRecording
                ? "Solte para encerrar"
                : "Segure para falar"}
          </Text>
          <Icon name="mic" size={20} color="#fff" className="ml-2" />
        </View>
      </Button>
    </View>
  );
}
