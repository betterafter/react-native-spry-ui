import { useEffect, useRef, useState } from 'react';

import { Animated, Easing, Pressable, Text, View } from 'react-native';

import { ANIMATION_DURATION, COLLAPSED_WIDTH } from './constants';
import { styles } from './styles';
import type {
  LabelWidths,
  ToggleNavigationItem,
  ToggleNavigationProps,
} from './types';
import { getBarWidth, getExpandedItemWidth } from './utils';

const timingConfig = {
  duration: ANIMATION_DURATION,
  easing: Easing.out(Easing.cubic),
  useNativeDriver: false,
} as const;

function animateTo(value: Animated.Value, toValue: number) {
  Animated.timing(value, {
    ...timingConfig,
    toValue,
  }).start();
}

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
  const barWidth = useRef(new Animated.Value(initialBarWidth)).current;

  useEffect(() => {
    const targetWidth = getBarWidth(
      items.length,
      labelWidths[activeIndex] ?? 0
    );

    animateTo(barWidth, targetWidth);
  }, [activeIndex, items.length, labelWidths, barWidth]);

  return (
    <Animated.View style={[styles.container, { width: barWidth }]}>
      {items.map((item, index) => {
        const selected = activeIndex === index;

        const Icon = selected ? item.selectedIcon : item.unselectedIcon;

        return (
          <Pressable key={item.key} onPress={() => onPress(index)}>
            <NavigationItem
              selected={selected}
              label={item.label}
              labelWidth={labelWidths[index] ?? 0}
              Icon={Icon}
            />
          </Pressable>
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
  const itemWidth = useRef(
    new Animated.Value(
      selected ? getExpandedItemWidth(labelWidth) : COLLAPSED_WIDTH
    )
  ).current;

  const visibleLabelWidth = useRef(
    new Animated.Value(selected ? labelWidth : 0)
  ).current;

  const labelOpacity = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    const targetItemWidth = selected
      ? getExpandedItemWidth(labelWidth)
      : COLLAPSED_WIDTH;

    animateTo(itemWidth, targetItemWidth);
    animateTo(visibleLabelWidth, selected ? labelWidth : 0);
    animateTo(labelOpacity, selected ? 1 : 0);
  }, [selected, labelWidth, itemWidth, visibleLabelWidth, labelOpacity]);

  return (
    <Animated.View
      style={[
        styles.item,
        selected ? styles.selectedItem : styles.unselectedItem,
        { width: itemWidth },
      ]}
    >
      <View style={styles.iconSlot}>{Icon}</View>

      <Animated.View
        style={[
          styles.labelContainer,
          { width: visibleLabelWidth, opacity: labelOpacity },
        ]}
      >
        <Text numberOfLines={1} style={styles.labelText} ellipsizeMode="clip">
          {label}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}
