import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ToggleNavigation } from '../../../src/navigation/ToggleNavigation';
import { LucideHome, LucideSettings } from 'lucide-react-native';

export default function MainScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ToggleNavigation
        items={[
          {
            key: 'home',
            label: 'Home',
            unselectedIcon: LucideHome,
            selectedIcon: LucideHome,
            onPress: () => console.log('home'),
          },
          {
            key: 'settings',
            label: 'Settings',
            unselectedIcon: LucideSettings,
            selectedIcon: LucideSettings,
            onPress: () => console.log('settings'),
          },
        ]}
        value={0}
        onChange={() => {
          console.log('change');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
