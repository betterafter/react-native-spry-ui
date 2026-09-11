import { useEffect, useState } from 'react';

import { Pressable, Text, View } from 'react-native';

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ANIMATION_DURATION, COLLAPSED_WIDTH } from './constants';
import { styles } from './styles';
import type {
  LabelWidths,
  ToggleNavigationItem,
  ToggleNavigationProps,
} from './types';
import { getBarWidth, getExpandedItemWidth } from './utils';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ToggleNavigation({
  items,
  value,
  onChange,
}: ToggleNavigationProps) {
  const [activeIndex, setActiveIndex] = useState(value);
  const [labelWidths, setLabelWidths] = useState<LabelWidths>({});

  const measurementComplete = Object.keys(labelWidths).length === items.length;

  useEffect(() => {
    setActiveIndex(value);
  }, [value]);

  const handlePress = (index: number) => {
    setActiveIndex(index);
    onChange(index);

    items[index]?.onPress?.();
  };

  return (
    <>
      {!measurementComplete && (
        <View pointerEvents="none" style={styles.measureContainer}>
          {items.map((item, index) => (
            <Text
              key={`measure-${item.key}`}
              numberOfLines={1}
              style={styles.labelText}
              onLayout={(event) => {
                const { width } = event.nativeEvent.layout;

                setLabelWidths((prev) => {
                  if (prev[index] === width) {
                    return prev;
                  }

                  return {
                    ...prev,
                    [index]: width,
                  };
                });

                console.log('width', width);
              }}
            >
              {item.label}
            </Text>
          ))}
        </View>
      )}

      {measurementComplete && (
        <NavigationBar
          items={items}
          activeIndex={activeIndex}
          labelWidths={labelWidths}
          onPress={handlePress}
        />
      )}
    </>
  );
}

function NavigationBar({
  items,
  activeIndex,
  labelWidths,
  onPress,
}: {
  items: ToggleNavigationItem[];
  activeIndex: number;
  labelWidths: LabelWidths;
  onPress: (index: number) => void;
}) {
  const activeLabelWidth = labelWidths[activeIndex] ?? 0;
  const initialBarWidth = getBarWidth(items.length, activeLabelWidth);
  const barWidth = useSharedValue(initialBarWidth);

  useEffect(() => {
    const targetWidth = getBarWidth(
      items.length,
      labelWidths[activeIndex] ?? 0
    );

    barWidth.value = withTiming(targetWidth, {
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [activeIndex, items.length, labelWidths, barWidth]);

  const barAnimatedStyle = useAnimatedStyle(() => ({
    width: barWidth.value,
  }));

  return (
    <Animated.View style={[styles.container, barAnimatedStyle]}>
      {items.map((item, index) => {
        const selected = activeIndex === index;

        const Icon = selected ? item.selectedIcon : item.unselectedIcon;

        return (
          <AnimatedPressable key={item.key} onPress={() => onPress(index)}>
            <NavigationItem
              selected={selected}
              label={item.label}
              labelWidth={labelWidths[index] ?? 0}
              Icon={Icon}
            />
          </AnimatedPressable>
        );
      })}
    </Animated.View>
  );
}

function NavigationItem({
  selected,
  label,
  labelWidth,
  Icon,
}: {
  selected: boolean;
  label: string;
  labelWidth: number;
  Icon: React.ReactNode;
}) {
  const itemWidth = useSharedValue(
    selected ? getExpandedItemWidth(labelWidth) : COLLAPSED_WIDTH
  );

  const visibleLabelWidth = useSharedValue(selected ? labelWidth : 0);

  const labelOpacity = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    const targetItemWidth = selected
      ? getExpandedItemWidth(labelWidth)
      : COLLAPSED_WIDTH;

    itemWidth.value = withTiming(targetItemWidth, {
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
    });

    visibleLabelWidth.value = withTiming(selected ? labelWidth : 0, {
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
    });

    labelOpacity.value = withTiming(selected ? 1 : 0, {
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [selected, labelWidth, itemWidth, visibleLabelWidth, labelOpacity]);

  const itemAnimatedStyle = useAnimatedStyle(() => ({
    width: itemWidth.value,
  }));

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    width: visibleLabelWidth.value,
    opacity: labelOpacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.item,
        selected ? styles.selectedItem : styles.unselectedItem,
        itemAnimatedStyle,
      ]}
    >
      <View style={styles.iconSlot}>{Icon}</View>

      <Animated.View style={[styles.labelContainer, labelAnimatedStyle]}>
        <Text numberOfLines={1} style={styles.labelText}>
          {label}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}
