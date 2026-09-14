import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ToggleNavigation } from '../../../../src/navigation/ToggleNavigation';
import { HouseIcon } from 'phosphor-react-native/src/icons/House';
import { MagnifyingGlassIcon } from 'phosphor-react-native/src/icons/MagnifyingGlass';
import { UserIcon } from 'phosphor-react-native/src/icons/User';
import { GearIcon } from 'phosphor-react-native/src/icons/Gear';

export default function BottomNavigationScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        { paddingBottom: insets.bottom },
      ])}
    >
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
            key: 'search',
            label: 'Search',
            unselectedIcon: (
              <MagnifyingGlassIcon size={20} color="white" weight="regular" />
            ),
            selectedIcon: (
              <MagnifyingGlassIcon size={20} color="black" weight="fill" />
            ),
            onPress: () => console.log('search'),
          },
          {
            key: 'profile',
            label: 'Profile',
            unselectedIcon: (
              <UserIcon size={20} color="white" weight="regular" />
            ),
            selectedIcon: <UserIcon size={20} color="black" weight="fill" />,
            onPress: () => console.log('profile'),
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
