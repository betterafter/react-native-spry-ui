import { useRef, useState } from 'react';
import type { VerticalCard, VerticalCardAnimationProps } from '../types';
import { Animated, Easing } from 'react-native';
import { CARD_GAP } from '../constants';

export default function usePosition({ cards }: VerticalCardAnimationProps) {
  const positionMap = new Map<number, Animated.Value>(
    cards.map((_, index) => [index, new Animated.Value(index * CARD_GAP)])
  );

  console.log(positionMap);

  const [currentIndex, setCurrentIndex] = useState(0);

  //   const swipePrev = () => {
  //     if (nextIndex === 0) {
  //       setCurrentIndex(currentIndex - 1);
  //       setNextIndex(cards.length - 1);
  //     } else if (currentIndex === cards.length - 1) {
  //       setCurrentIndex(cards.length - 1);
  //       setNextIndex(nextIndex - 1);
  //     } else {
  //       setCurrentIndex(currentIndex - 1);
  //       setNextIndex(nextIndex - 1);
  //     }
  //   };

  //   const swipeNext = () => {
  //     if (nextIndex === cards.length - 1) {
  //       setCurrentIndex(currentIndex + 1);
  //       setNextIndex(0);
  //     } else if (currentIndex === cards.length - 1) {
  //       setCurrentIndex(0);
  //       setNextIndex(nextIndex + 1);
  //     } else {
  //       setCurrentIndex(currentIndex + 1);
  //       setNextIndex(nextIndex + 1);
  //     }
  //   };

  const animatedSwipePrev = () => {
    const currentPoisition = positionMap.get(currentIndex);
    const nextPosition =
      cards.length > currentIndex + 1
        ? positionMap.get(currentIndex + 1)
        : null;
    const nextNextPosition =
      cards.length > currentIndex + 2
        ? positionMap.get(currentIndex + 2)
        : null;

    const currentAnimation = currentPoisition
      ? Animated.timing(currentPoisition, {
          toValue: -CARD_GAP,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        })
      : null;

    const nextAnimation = nextPosition
      ? Animated.timing(nextPosition, {
          toValue: 0,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        })
      : null;

    const nextNextAnimation = nextNextPosition
      ? Animated.timing(nextNextPosition, {
          toValue: CARD_GAP,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        })
      : null;

    const animations = [
      currentAnimation,
      nextAnimation,
      nextNextAnimation,
    ].filter((animation) => animation !== null);

    Animated.parallel(animations).start();
  };

  const animatedSwipeNext = () => {};

  return {
    positionMap,
    currentPosition: positionMap.get(currentIndex),
    nextPosition: positionMap.get(currentIndex + 1),
    nextNextPosition: positionMap.get(currentIndex + 2),
    animatedSwipePrev,
    animatedSwipeNext,
    currentIndex,
    // swipePrev,
    // swipeNext,
  };
}
