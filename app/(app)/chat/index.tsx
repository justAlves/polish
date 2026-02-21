import { Skeleton } from "@/components/atoms/skeleton";
import { useGetConversations } from "@/hooks/use-chat";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function ConversationSkeleton() {
  return (
    <View className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-3">
          <Skeleton width={46} height={46} borderRadius={23} />
          <View style={{ gap: 6 }}>
            <Skeleton width={100} height={14} />
            <Skeleton width={64} height={11} />
          </View>
        </View>
        <View className="items-end" style={{ gap: 6 }}>
          <Skeleton width={80} height={11} />
          <Skeleton width={52} height={11} />
        </View>
      </View>
      <View className="flex-row gap-2">
        <Skeleton height={40} borderRadius={12} width="48%" />
        <Skeleton height={40} borderRadius={12} width="48%" />
      </View>
    </View>
  );
}

export default function ConversationsScreen() {
  const { data, isLoading, refetch } = useGetConversations();

  console.log(data);

  return (
    <View className="flex-1 bg-neutral-950">
      <SafeAreaView edges={["top"]}>
        <View className="px-8 pt-4 pb-6 flex-row justify-between items-start">
          <View>
            <Text className="text-white font-space-mono text-2xl font-bold">
              Conversas
            </Text>
            <Text className="text-neutral-400 mt-1 text-sm leading-5">
              Seu histórico de práticas
            </Text>
          </View>

          <Pressable
            onPress={() => router.push("/(app)/chat/new")}
            className="bg-indigo-600 rounded-2xl px-4 py-2.5 flex-row items-center gap-2 mt-1"
          >
            <Feather name="plus" size={16} color="#fff" />
            <Text className="text-white text-sm font-semibold">Nova</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      {isLoading && !data ? (
        <View style={{ paddingHorizontal: 32, gap: 12 }}>
          <ConversationSkeleton />
          <ConversationSkeleton />
          <ConversationSkeleton />
        </View>
      ) : (
        <FlatList
          data={data || []}
          onRefresh={refetch}
          refreshing={isLoading}
          contentContainerStyle={{
            paddingHorizontal: 32,
            gap: 12,
            paddingBottom: 24,
          }}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View className="items-center mt-24">
              <View className="w-16 h-16 bg-neutral-900 rounded-full items-center justify-center mb-4">
                <Feather name="message-square" size={28} color="#404040" />
              </View>
              <Text className="text-neutral-400 text-base font-space-mono">
                Nenhuma conversa ainda
              </Text>
              <Text className="text-neutral-600 text-sm mt-2">
                Toque em "Nova" para começar
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-3">
                  <Text style={{ fontSize: 30 }}>{item.flag}</Text>
                  <View>
                    <Text className="text-white font-semibold text-base">
                      {item.language}
                    </Text>
                    <Text className="text-neutral-500 text-xs mt-0.5">
                      {item.nativeName}
                    </Text>
                  </View>
                </View>

                <View className="items-end">
                  <Text className="text-neutral-500 text-xs">{item.date}</Text>
                  <View className="flex-row items-center gap-1 mt-1">
                    <Feather name="clock" size={10} color="#525252" />
                    <Text className="text-neutral-600 text-xs">
                      {item.duration}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => router.push(`/(app)/chat/${item.id}`)}
                  className="flex-1 bg-indigo-600 rounded-xl py-2.5 flex-row items-center justify-center gap-1.5"
                >
                  <Feather name="mic" size={14} color="#fff" />
                  <Text className="text-white text-sm font-semibold">
                    Continuar
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    router.push(`/(app)/chat/${item.id}/analysis`)
                  }
                  className="flex-1 border border-neutral-700 rounded-xl py-2.5 flex-row items-center justify-center gap-1.5"
                >
                  <Feather name="bar-chart-2" size={14} color="#a3a3a3" />
                  <Text className="text-neutral-300 text-sm font-semibold">
                    Análise
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
