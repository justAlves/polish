import { Button } from "@/components/base/button";
import Aurora from "@/components/molecules/aurora";
import DynamicText from "@/components/molecules/dynamic-text";
import { DynamicTextItem } from "@/components/molecules/dynamic-text/types";
import { router } from "expo-router";
import { Text, View } from "react-native";

const greetings: readonly DynamicTextItem[] = [
  { text: "Hello", id: "en" },
  { text: "こんにちは", id: "ja" },
  { text: "Bonjour 👋", id: "fr" },
  { text: "Hola", id: "es" },
  { text: "안녕하세요", id: "ko" },
  { text: "Oi!", id: "pt" },
] as const;

export default function WelcomeScreen() {
  return (
    <View className="flex-1">
      <Aurora height={350} />
      <View className="absolute left-[15%] top-[15%]">
        <DynamicText
          items={greetings}
          initialIndex={2}
          paused={false}
          text={{
            fontSize: 32,
            fontWeight: 700,
          }}
          timing={{
            animationDuration: 200,
            interval: 1500,
          }}
          loop
          dot={{
            size: 0,
          }}
        />
      </View>

      <View className="bg-neutral-950 rounded-t-[40px] flex-1 -mt-10 px-8 pt-10 items-center">
        <Text className="text-white text-center font-space-mono text-2xl font-bold">
          Welcome to Polish
        </Text>
        <Text className="text-neutral-400 text-center mt-4 text-base leading-6">
          Pratique idiomas conversando com uma IA e receba feedbacks
          personalizados para evoluir cada vez mais.
        </Text>

        <View className="w-full items-center gap-3 mt-20">
          <Button
            onPress={() => router.push("/(auth)/login")}
            width={300}
            height={52}
            backgroundColor="transparent"
            gradientColors={["#6366f1", "#8b5cf6", "#a78bfa"]}
          >
            <Text className="text-white text-base font-semibold">Entrar</Text>
          </Button>

          <Button
            onPress={() => router.push("/(auth)/register")}
            width={300}
            height={52}
            backgroundColor="transparent"
            style={{ borderWidth: 1, borderColor: "#6366f1" }}
          >
            <Text className="text-indigo-400 text-base font-semibold">
              Criar conta
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
