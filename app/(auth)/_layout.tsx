import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function LoginScreen() {
 return (
   <Stack
    initialRouteName='welcome'
    screenOptions={{
        headerShown: false
    }}
   >
    <Stack.Screen
        name='login'
    />
    <Stack.Screen
        name='register'
    />
    <Stack.Screen
        name='welcome'
    />

   </Stack>
  );
}