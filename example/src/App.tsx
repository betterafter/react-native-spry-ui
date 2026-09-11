import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainScreen, { type ScreenName } from './screens/MainScreen';
import BottomNavigationScreen from './screens/BottomNavigationScreen';

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('main');

  return (
    <SafeAreaProvider>
      {screen === 'main' && <MainScreen onNavigate={setScreen} />}
      {screen === 'bottom-navigation' && <BottomNavigationScreen />}
    </SafeAreaProvider>
  );
}
