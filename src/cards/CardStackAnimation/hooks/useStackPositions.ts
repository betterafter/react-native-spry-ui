import { Animated, Easing } from 'react-native';
import { useCallback, useRef } from 'react';

import type { StackCard, WindowCard } from '../types';

type UseStackPositionsParams = {
  getWindowAt: (index: number) => WindowCard[];
};

export function useStackPositions({ getWindowAt }: UseStackPositionsParams) {
  const positionMap = useRef<Map<string, Animated.Value>>(new Map()).current;

  const getPosition = useCallback(
    (card: StackCard, initialValue: number) => {
      const current = positionMap.get(card.id);

      if (current) {
        return current;
      }

      const value = new Animated.Value(initialValue);
      positionMap.set(card.id, value);

      return value;
    },
    [positionMap]
  );

  const resetPositions = useCallback(
    (index: number, gap: number) => {
      getWindowAt(index).forEach(({ card, offset }) => {
        getPosition(card, offset * gap).setValue(offset * gap);
      });
    },
    [getPosition, getWindowAt]
  );

  const clearPositions = useCallback(() => {
    positionMap.clear();
  }, [positionMap]);

  /** Sync existing Animated values when cardGap changes (call during render). */
  const syncGapDuringRender = useCallback(
    (index: number, gap: number) => {
      getWindowAt(index).forEach(({ card, offset }) => {
        const value = positionMap.get(card.id);

        if (value) {
          value.setValue(offset * gap);
        }
      });
    },
    [getWindowAt, positionMap]
  );

  const moveCards = useCallback(
    (index: number, progress: number, direction: number, gap: number) => {
      getWindowAt(index).forEach(({ card, offset }) => {
        const startY = offset * gap;
        const targetY = (offset + direction) * gap;
        const y = startY + (targetY - startY) * progress;

        getPosition(card, startY).setValue(y);
      });
    },
    [getPosition, getWindowAt]
  );

  const animateWindowTo = useCallback(
    (
      index: number,
      offsetDelta: number,
      gap: number,
      duration: number,
      onComplete?: () => void
    ) => {
      const animations = getWindowAt(index).map(({ card, offset }) =>
        Animated.timing(getPosition(card, offset * gap), {
          toValue: (offset + offsetDelta) * gap,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      );

      Animated.parallel(animations).start(onComplete);
    },
    [getPosition, getWindowAt]
  );

  return {
    getPosition,
    resetPositions,
    clearPositions,
    syncGapDuringRender,
    moveCards,
    animateWindowTo,
  };
}
