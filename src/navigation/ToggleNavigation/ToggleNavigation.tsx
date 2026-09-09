import type { ComponentType } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export interface ToggleNavigationItem {
  key: string;
  label: string;
  icon: IconComponent;
  onPress: () => void;
}

export type IconComponent = ComponentType<{
  size?: number;
  color?: string;
}>;

export default function ToggleNavigation({
  items,
  value,
  onChange,
}: {
  items: ToggleNavigationItem[];
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <View style={styles.container}>
      {items.map((item) => {
        return (
          <Pressable key={item.key} onPress={item.onPress} style={styles.item}>
            <item.icon size={24} color="black" />
            <View>
              <Text>{item.label}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 30,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'white',
    borderTopColor: 'gray',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
