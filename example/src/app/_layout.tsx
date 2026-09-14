import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Spry UI' }} />
      <Stack.Screen name="card/index" options={{ title: 'Cards' }} />
      <Stack.Screen
        name="bottom-navigation/index"
        options={{ title: 'Bottom Navigation' }}
      />
    </Stack>
  );
}
