import { auth } from '@/lib/auth';
import { Redirect, Stack } from 'expo-router';
import { View } from 'react-native';

export default function LoginScreen() {

    const { data: session } = auth.useSession();

    if(session) {
        return (
            <Redirect href="/dashboard" />
        )
    }

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