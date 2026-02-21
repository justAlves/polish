import { Feather } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TAB_CONFIG = [
  { name: "dashboard", icon: "home" as const, label: "Dashboard" },
  { name: "chat", icon: "message-square" as const, label: "Chat" },
  { name: "profile", icon: "user" as const, label: "Perfil" },
];

function TabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "#0a0a0a" }}>
      <View className="items-center pb-4">
        <View
          className="flex-row bg-neutral-900 border border-neutral-800 rounded-[28px] p-1.5 gap-1"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          {state.routes.map((route, index) => {
            const tab = TAB_CONFIG[index];
            const isFocused = state.index === index;

            return (
              <Pressable
                key={route.key}
                onPress={() => navigation.navigate(route.name)}
                className={`flex-row items-center gap-2 px-5 py-3 rounded-[22px] ${
                  isFocused ? "bg-indigo-600" : ""
                }`}
              >
                <Feather
                  name={tab.icon}
                  size={20}
                  color={isFocused ? "#fff" : "#525252"}
                />
                {isFocused && (
                  <Text className="text-white text-sm font-semibold">
                    {tab.label}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function AppLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: "#0a0a0a" } }}
    >
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
