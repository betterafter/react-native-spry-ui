import { useEffect, useState, type ComponentType } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export interface ToggleNavigationItem {
  key: string;
  label: string;
  unselectedIcon: IconComponent;
  selectedIcon: IconComponent;
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
  const [activeIndex, setActiveIndex] = useState(value);

  useEffect(() => {
    setActiveIndex(value);
  }, [value]);

  const handlePress = (index: number) => {
    setActiveIndex(index);
    onChange(index);
  };

  return (
    <View style={styles.container}>
      {items.map((item, index) => {
        return (
          <Pressable
            key={item.key}
            onPress={() => handlePress(index)}
            style={
              activeIndex === index
                ? styles.selectedItem
                : styles.unselectedItem
            }
          >
            <View>
              {activeIndex === index ? (
                <View style={styles.selectedItemContent}>
                  <item.selectedIcon
                    size={20}
                    color={styles.selectedItemText.color}
                  />
                  <Text style={styles.selectedItemText}>{item.label}</Text>
                </View>
              ) : (
                <View style={styles.unselectedItemContent}>
                  <item.unselectedIcon
                    size={20}
                    color={styles.unselectedItemText.color}
                  />
                </View>
              )}
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
    bottom: 50,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 100,
    backgroundColor: '#1D1F1E',
    gap: 8,
    paddingHorizontal: 8,
  },
  selectedItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  unselectedItem: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
  },
  unselectedItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2F3231',
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 4,
  },
  selectedItemText: {
    color: '#2B2E2D',
  },
  unselectedItemText: {
    color: '#CDCFCE',
  },
});
