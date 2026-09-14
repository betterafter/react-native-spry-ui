import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { useCardImageLoading } from './useCardImageLoading';
import { useStackGesture } from './useStackGesture';
import { useStackPositions } from './useStackPositions';

import { getWindowCards, normalizeIndex } from '../utils';

import type { StackCard } from '../types';

type UseCardStackAnimationParams = {
  initialCards: StackCard[];
  cardGap: number;
  dragDistance: number;
  swipeThreshold: number;
};

export function useCardStackAnimation({
  initialCards,
  cardGap,
  dragDistance,
  swipeThreshold,
}: UseCardStackAnimationParams) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stackWidth, setStackWidth] = useState(0);

  const cardsRef = useRef(initialCards);
  const currentIndexRef = useRef(0);

  cardsRef.current = initialCards;

  const getWindowAt = useCallback(
    (index: number) => getWindowCards(cardsRef.current, index),
    []
  );

  const {
    getPosition,
    resetPositions,
    clearPositions,
    syncGapDuringRender,
    moveCards,
    animateWindowTo,
  } = useStackPositions({ getWindowAt });

  const handleCardsReset = useCallback(() => {
    currentIndexRef.current = 0;
    clearPositions();
    setCurrentIndex(0);
    resetPositions(0, cardGap);
  }, [cardGap, clearPositions, resetPositions]);

  const { loadedCardIds, initialLoaded, loadEpoch, handleImageLoad } =
    useCardImageLoading({
      cards: initialCards,
      currentIndex,
      onCardsReset: handleCardsReset,
    });

  // Keep Animated values in sync when cardGap changes (before paint).
  const prevCardGapRef = useRef(cardGap);

  if (prevCardGapRef.current !== cardGap) {
    prevCardGapRef.current = cardGap;
    syncGapDuringRender(currentIndexRef.current, cardGap);
  }

  // Re-slot positions to the new gap before paint — keep index & values alive.
  useLayoutEffect(() => {
    resetPositions(currentIndexRef.current, cardGap);
  }, [cardGap, resetPositions]);

  const handleDrag = useCallback(
    (dy: number) => {
      if (cardsRef.current.length === 0) {
        return;
      }

      const progress = Math.min(Math.abs(dy) / dragDistance, 1);

      if (dy > 0) {
        moveCards(currentIndexRef.current, progress, 1, cardGap);
        return;
      }

      if (dy < 0) {
        moveCards(currentIndexRef.current, progress, -1, cardGap);
      }
    },
    [cardGap, dragDistance, moveCards]
  );

  const returnToOriginalPosition = useCallback(() => {
    animateWindowTo(currentIndexRef.current, 0, cardGap, 180);
  }, [animateWindowTo, cardGap]);

  const completePrevious = useCallback(() => {
    const current = currentIndexRef.current;

    animateWindowTo(current, -1, cardGap, 220, () => {
      const nextIndex = normalizeIndex(current + 1, cardsRef.current.length);
      currentIndexRef.current = nextIndex;
      resetPositions(nextIndex, cardGap);
      setCurrentIndex(nextIndex);
    });
  }, [animateWindowTo, cardGap, resetPositions]);

  const completeNext = useCallback(() => {
    const current = currentIndexRef.current;

    animateWindowTo(current, 1, cardGap, 220, () => {
      const nextIndex = normalizeIndex(current - 1, cardsRef.current.length);
      currentIndexRef.current = nextIndex;
      resetPositions(nextIndex, cardGap);
      setCurrentIndex(nextIndex);
    });
  }, [animateWindowTo, cardGap, resetPositions]);

  const handleRelease = useCallback(
    (dy: number) => {
      if (dy > swipeThreshold) {
        completeNext();
        return;
      }

      if (dy < -swipeThreshold) {
        completePrevious();
        return;
      }

      returnToOriginalPosition();
    },
    [completeNext, completePrevious, returnToOriginalPosition, swipeThreshold]
  );

  const panResponder = useStackGesture({
    onDrag: handleDrag,
    onRelease: handleRelease,
    onCancel: returnToOriginalPosition,
  });

  const windowCards = getWindowCards(initialCards, currentIndex);

  return {
    currentIndex,
    stackWidth,
    setStackWidth,
    windowCards,
    loadedCardIds,
    initialLoaded,
    loadEpoch,
    handleImageLoad,
    getPosition,
    panResponder,
  };
}
