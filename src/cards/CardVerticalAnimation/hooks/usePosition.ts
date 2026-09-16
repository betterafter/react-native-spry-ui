import { useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

import type { VerticalCardAnimationProps } from '../types';
import { ANIMATION_DURATION, CARD_GAP } from '../constants';
import { getWindowCards } from '../utils';

export default function usePosition({ cards }: VerticalCardAnimationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const isAnimating = useRef(false);
  const positions = useRef(new Map<string, Animated.Value>()).current;

  const getPosition = (cardId: string, initial: number) => {
    let value = positions.get(cardId);

    if (!value) {
      value = new Animated.Value(initial);
      positions.set(cardId, value);
    }

    return value;
  };

  const resetPositions = (index: number) => {
    getWindowCards(cards, index).forEach(({ card, offset }) => {
      getPosition(card.id, offset * CARD_GAP).setValue(offset * CARD_GAP);
    });
  };

  const animatedSwipeNext = () => {
    if (cards.length <= 1 || isAnimating.current) {
      return;
    }

    isAnimating.current = true;

    const index = currentIndexRef.current;
    const window = getWindowCards(cards, index);

    Animated.parallel(
      window.map(({ card, offset }) =>
        Animated.timing(getPosition(card.id, offset * CARD_GAP), {
          toValue: (offset - 1) * CARD_GAP,
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      )
    ).start(({ finished }) => {
      if (!finished) {
        isAnimating.current = false;
        return;
      }

      const nextIndex = (index + 1) % cards.length;

      currentIndexRef.current = nextIndex;
      resetPositions(nextIndex);
      setCurrentIndex(nextIndex);
      isAnimating.current = false;
    });
  };

  const animatedSwipePrev = () => {
    if (cards.length <= 1 || isAnimating.current) {
      return;
    }

    isAnimating.current = true;

    const index = currentIndexRef.current;
    const window = getWindowCards(cards, index);

    Animated.parallel(
      window.map(({ card, offset }) =>
        Animated.timing(getPosition(card.id, offset * CARD_GAP), {
          toValue: (offset + 1) * CARD_GAP,
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      )
    ).start(({ finished }) => {
      if (!finished) {
        isAnimating.current = false;
        return;
      }

      const prevIndex = (index - 1 + cards.length) % cards.length;
      currentIndexRef.current = prevIndex;

      resetPositions(prevIndex);

      setCurrentIndex(prevIndex);

      isAnimating.current = false;
    });
  };

  return {
    windowCards: getWindowCards(cards, currentIndex),
    getPosition,
    animatedSwipePrev,
    animatedSwipeNext,
    currentIndex,
  };
}
