import { useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

import type { VerticalCardAnimationProps } from '../types';
import { CARD_GAP } from '../constants';

export default function usePosition({ cards }: VerticalCardAnimationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const position = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);

  const animatedSwipePrev = () => {
    if (cards.length <= 1 || isAnimating.current) {
      return;
    }

    isAnimating.current = true;

    Animated.timing(position, {
      toValue: -CARD_GAP,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) {
        isAnimating.current = false;
        return;
      }

      setCurrentIndex((prev) => (prev + 1) % cards.length);

      requestAnimationFrame(() => {
        position.setValue(0);
        isAnimating.current = false;
      });
    });
  };

  const animatedSwipeNext = () => {};

  return {
    position,
    animatedSwipePrev,
    animatedSwipeNext,
    currentIndex,
  };
}
