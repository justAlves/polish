import { Feather } from "@expo/vector-icons";
import { Icon, NativeTabs, VectorIcon } from "expo-router/unstable-native-tabs";

export default function AppLayout() {
  return (
    <NativeTabs backgroundColor={"#0a0a0a"}>
      <NativeTabs.Trigger name="dashboard" options={{ title: "Dashboard" }}>
        <Icon src={<VectorIcon family={Feather} name="home" />} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="chat" options={{ title: "Chat" }}>
        <Icon src={<VectorIcon family={Feather} name="message-square" />} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile" options={{ title: "Perfil" }}>
        <Icon src={<VectorIcon family={Feather} name="user" />} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
