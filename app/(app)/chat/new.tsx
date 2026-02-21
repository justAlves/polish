import { Skeleton } from "@/components/atoms/skeleton";
import { useToast } from "@/components/molecules/toast";
import { useCreateConversation } from "@/hooks/use-chat";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Espanhol", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Francês", nativeName: "Français", flag: "🇫🇷" },
  { code: "ja", name: "Japonês", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Coreano", nativeName: "한국어", flag: "🇰🇷" },
  { code: "de", name: "Alemão", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "zh", name: "Chinês", nativeName: "中文", flag: "🇨🇳" },
];

type LanguageCode =
  | "en"
  | "pt"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "ja"
  | "ko"
  | "zh";

export default function NewConversationScreen() {
  const { mutate: createConversation, isPending } = useCreateConversation();
  const toast = useToast();
  const [selectedCode, setSelectedCode] = useState<LanguageCode | null>(null);

  const handleSelectLanguage = (code: LanguageCode) => {
    setSelectedCode(code);
    createConversation(code, {
      onSuccess: (data) => {
        console.log("Conversation created with ID:", data.id);
        router.push(`/(app)/chat/${data.id}`);
      },
      onError: (error) => {
        console.error("Failed to create conversation:", error);
        setSelectedCode(null);
        toast.show(
          "Não foi possível criar a conversa. Por favor, tente novamente.",
          { type: "error", position: "top" },
        );
      },
    });
  };

  return (
    <View className="flex-1 bg-neutral-950">
      <SafeAreaView edges={["top"]}>
        <View className="px-8 pt-4 pb-6">
          <Pressable onPress={() => router.back()} className="mb-6">
            <Feather name="arrow-left" size={24} color="#fff" />
          </Pressable>
          <Text className="text-white font-space-mono text-2xl font-bold">
            Novo idioma
          </Text>
          <Text className="text-neutral-400 mt-1 text-sm leading-5">
            Selecione o idioma para praticar
          </Text>
        </View>
      </SafeAreaView>

      <FlatList
        data={LANGUAGES}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: 32,
          paddingBottom: 24,
          gap: 12,
        }}
        columnWrapperStyle={{ gap: 12 }}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => {
          const isSelected = item.code === selectedCode;
          const isOther = isPending && !isSelected;

          if (isSelected) {
            return (
              <View
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 items-center"
                style={{ gap: 8 }}
              >
                <Skeleton width={38} height={38} borderRadius={8} />
                <Skeleton width={72} height={13} borderRadius={6} />
                <Skeleton width={48} height={11} borderRadius={6} />
              </View>
            );
          }

          return (
            <Pressable
              onPress={() =>
                !isPending && handleSelectLanguage(item.code as LanguageCode)
              }
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 items-center"
              style={{ gap: 8, opacity: isOther ? 0.35 : 1 }}
            >
              <Text style={{ fontSize: 38 }}>{item.flag}</Text>
              <Text className="text-white font-semibold text-sm text-center">
                {item.name}
              </Text>
              <Text className="text-neutral-500 text-xs text-center">
                {item.nativeName}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
