import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding/index" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="workout" options={{ title: 'Log Workout' }} />
      </Stack>
    </>
  );
}
