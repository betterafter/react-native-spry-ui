import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ToggleNavigation } from '../../../src/navigation/ToggleNavigation';
import { HouseIcon } from 'phosphor-react-native/src/icons/House';
import { GearIcon } from 'phosphor-react-native/src/icons/Gear';

export default function MainScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ToggleNavigation
        items={[
          {
            key: 'home',
            label: 'Home',
            unselectedIcon: (
              <HouseIcon size={20} color="white" weight="regular" />
            ),
            selectedIcon: <HouseIcon size={20} color="black" weight="fill" />,
            onPress: () => console.log('home'),
          },
          {
            key: 'settings',
            label: 'Settings',
            unselectedIcon: (
              <GearIcon size={20} color="white" weight="regular" />
            ),
            selectedIcon: <GearIcon size={20} color="black" weight="fill" />,
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
