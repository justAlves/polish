import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable } from "react-native";

const MOCK_ANALYSIS = {
  overall: 78,
  scores: [
    { label: "Pronúncia", value: 72, icon: "mic" as const },
    { label: "Vocabulário", value: 85, icon: "book-open" as const },
    { label: "Fluência", value: 76, icon: "activity" as const },
    { label: "Gramática", value: 80, icon: "check-circle" as const },
  ],
  feedback: [
    {
      type: "positive" as const,
      text: "Boa pronúncia geral, especialmente nas consoantes",
    },
    {
      type: "positive" as const,
      text: "Uso natural de conectores como \"however\" e \"actually\"",
    },
    {
      type: "tip" as const,
      text: "Reduza as pausas longas para soar mais fluente",
    },
    {
      type: "tip" as const,
      text: "Pratique as vogais longas para maior clareza",
    },
  ],
  vocabulary: ["beautiful", "interesting", "however", "actually", "I think", "maybe", "really"],
};

function ScoreRing({ value }: { value: number }) {
  const color = value >= 80 ? "#22c55e" : value >= 60 ? "#eab308" : "#ef4444";
  return (
    <View className="items-center justify-center w-28 h-28">
      <View
        className="absolute w-28 h-28 rounded-full border-4"
        style={{ borderColor: "#262626" }}
      />
      <View
        className="absolute w-28 h-28 rounded-full border-4"
        style={{ borderColor: color, opacity: 0.9 }}
      />
      <Text className="text-white font-space-mono text-3xl font-bold">{value}</Text>
      <Text className="text-neutral-500 text-xs">/ 100</Text>
    </View>
  );
}

export default function AnalysisScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 bg-neutral-950">
      <SafeAreaView edges={["top"]}>
        <View className="px-8 pt-4 pb-2 flex-row items-center gap-4">
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </Pressable>
          <View>
            <Text className="text-white font-space-mono text-2xl font-bold">
              Análise
            </Text>
            <Text className="text-neutral-400 mt-0.5 text-sm">
              Resultado da sua prática
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 32, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall score */}
        <View className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 items-center">
          <Text className="text-neutral-400 text-sm mb-4 font-space-mono">
            Pontuação geral
          </Text>
          <ScoreRing value={MOCK_ANALYSIS.overall} />
          <Text className="text-neutral-400 text-xs mt-4 text-center leading-5">
            Muito bom! Continue praticando para{"\n"}melhorar ainda mais.
          </Text>
        </View>

        {/* Score breakdown */}
        <View className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <Text className="text-white font-semibold mb-4">Detalhes</Text>
          <View style={{ gap: 14 }}>
            {MOCK_ANALYSIS.scores.map((score) => (
              <View key={score.label}>
                <View className="flex-row items-center justify-between mb-1.5">
                  <View className="flex-row items-center gap-2">
                    <Feather name={score.icon} size={14} color="#737373" />
                    <Text className="text-neutral-300 text-sm">{score.label}</Text>
                  </View>
                  <Text className="text-white text-sm font-semibold font-space-mono">
                    {score.value}
                  </Text>
                </View>
                <View className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${score.value}%`,
                      backgroundColor:
                        score.value >= 80
                          ? "#22c55e"
                          : score.value >= 60
                            ? "#eab308"
                            : "#ef4444",
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Feedback */}
        <View className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <Text className="text-white font-semibold mb-4">Feedback</Text>
          <View style={{ gap: 10 }}>
            {MOCK_ANALYSIS.feedback.map((item, index) => (
              <View key={index} className="flex-row items-start gap-3">
                <View
                  className="w-6 h-6 rounded-full items-center justify-center mt-0.5 shrink-0"
                  style={{
                    backgroundColor:
                      item.type === "positive" ? "#14532d" : "#1c1917",
                  }}
                >
                  <Feather
                    name={item.type === "positive" ? "check" : "zap"}
                    size={12}
                    color={item.type === "positive" ? "#22c55e" : "#eab308"}
                  />
                </View>
                <Text className="text-neutral-300 text-sm leading-5 flex-1">
                  {item.text}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Vocabulary */}
        <View className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <Text className="text-white font-semibold mb-4">
            Vocabulário usado
          </Text>
          <View className="flex-row flex-wrap" style={{ gap: 8 }}>
            {MOCK_ANALYSIS.vocabulary.map((word) => (
              <View
                key={word}
                className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-1.5"
              >
                <Text className="text-neutral-300 text-sm font-space-mono">
                  {word}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
