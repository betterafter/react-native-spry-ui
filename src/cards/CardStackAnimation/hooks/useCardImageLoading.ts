import { Image } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';

import { PREFETCH_RANGE } from '../constants';
import { getCard, getWindowCards, isLocalAsset } from '../utils';

import type { StackCard } from '../types';

type UseCardImageLoadingParams = {
  cards: StackCard[];
  currentIndex: number;
  onCardsReset: () => void;
};

export function useCardImageLoading({
  cards,
  currentIndex,
  onCardsReset,
}: UseCardImageLoadingParams) {
  const [loadedCardIds, setLoadedCardIds] = useState<Set<string>>(
    () => new Set<string>()
  );
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [loadEpoch, setLoadEpoch] = useState(0);

  const cardsRef = useRef(cards);
  const loadedCardIdsRef = useRef<Set<string>>(new Set<string>());
  const initialCardIdsRef = useRef<Set<string>>(new Set<string>());
  const prefetchedUrisRef = useRef<Set<string>>(new Set<string>());
  const prefetchingUrisRef = useRef<Set<string>>(new Set<string>());

  cardsRef.current = cards;

  const prefetchAround = useCallback((index: number) => {
    const uris = new Set<string>();

    for (let offset = -PREFETCH_RANGE; offset <= PREFETCH_RANGE; offset += 1) {
      const card = getCard(cardsRef.current, index + offset);

      if (!card || typeof card.image !== 'string') {
        continue;
      }

      uris.add(card.image);
    }

    uris.forEach((uri) => {
      if (
        prefetchedUrisRef.current.has(uri) ||
        prefetchingUrisRef.current.has(uri)
      ) {
        return;
      }

      prefetchingUrisRef.current.add(uri);

      Image.prefetch(uri)
        .then((success) => {
          prefetchingUrisRef.current.delete(uri);

          if (success) {
            prefetchedUrisRef.current.add(uri);
          }
        })
        .catch(() => {
          prefetchingUrisRef.current.delete(uri);
        });
    });
  }, []);

  const checkInitialLoaded = useCallback((loadedIds: Set<string>) => {
    const required = initialCardIdsRef.current;

    if (required.size === 0) {
      return;
    }

    if ([...required].every((id) => loadedIds.has(id))) {
      setInitialLoaded(true);
    }
  }, []);

  const handleImageLoad = useCallback(
    (card: StackCard) => {
      if (loadedCardIdsRef.current.has(card.id)) {
        return;
      }

      const next = new Set(loadedCardIdsRef.current);
      next.add(card.id);
      loadedCardIdsRef.current = next;
      setLoadedCardIds(next);
      checkInitialLoaded(next);
    },
    [checkInitialLoaded]
  );

  // Full reset only when the card list changes.
  useEffect(() => {
    loadedCardIdsRef.current = new Set<string>();
    prefetchedUrisRef.current = new Set<string>();
    prefetchingUrisRef.current = new Set<string>();

    setLoadedCardIds(new Set<string>());
    setInitialLoaded(false);
    setLoadEpoch((epoch) => epoch + 1);

    const initialWindow = getWindowCards(cards, 0);

    initialCardIdsRef.current = new Set(
      initialWindow.map(({ card }) => card.id)
    );

    const alreadyLoaded = new Set<string>();

    initialWindow.forEach(({ card }) => {
      if (isLocalAsset(card.image)) {
        alreadyLoaded.add(card.id);
      }
    });

    if (alreadyLoaded.size > 0) {
      loadedCardIdsRef.current = alreadyLoaded;
      setLoadedCardIds(alreadyLoaded);
    }

    if (
      initialCardIdsRef.current.size === 0 ||
      [...initialCardIdsRef.current].every((id) => alreadyLoaded.has(id))
    ) {
      setInitialLoaded(true);
    }

    onCardsReset();
    prefetchAround(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  useEffect(() => {
    prefetchAround(currentIndex);
  }, [currentIndex, prefetchAround]);

  return {
    loadedCardIds,
    initialLoaded,
    loadEpoch,
    handleImageLoad,
  };
}
