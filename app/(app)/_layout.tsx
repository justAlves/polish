import { Tabs } from "expo-router";

export default function AppLayout() {
 return (
   <Tabs initialRouteName="dashboard">
        <Tabs.Screen name="dashboard" options={{ headerShown: false }} />
        <Tabs.Screen name="chat" options={{ headerShown: false }} />
        <Tabs.Screen name="profile" options={{ headerShown: false }} />
   </Tabs>
 );
}