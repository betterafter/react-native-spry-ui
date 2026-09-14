import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';

import { styles } from './styles';

import type { CardStackAnimationProps, StackCard } from './types';

import { CARD_GAP, DRAG_DISTANCE, SWIPE_THRESHOLD } from './constants';

const VISIBLE_CARD_COUNT = 3;
const PREFETCH_RANGE = 5;
const WINDOW_OFFSETS = [-1, 0, 1, 2, 3];

type WindowCard = {
  card: StackCard;
  offset: number;
};

type CardContentProps = {
  card: StackCard;
  loaded: boolean;
  onLoad: (card: StackCard) => void;
};

function Skeleton() {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.75,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        localStyles.skeleton,
        {
          opacity,
        },
      ]}
    />
  );
}

function CardContent({ card, loaded, onLoad }: CardContentProps) {
  return (
    <>
      <Image
        source={
          typeof card.image === 'string' ? { uri: card.image } : card.image
        }
        resizeMode="cover"
        style={localStyles.image}
        onLoad={() => {
          onLoad(card);
        }}
      />

      {!loaded && <Skeleton />}
    </>
  );
}

export default function CardStackAnimation({
  initialCards = [],
  cardGap = CARD_GAP,
  dragDistance = DRAG_DISTANCE,
  swipeThreshold = SWIPE_THRESHOLD,
}: CardStackAnimationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [loadedCardIds, setLoadedCardIds] = useState<Set<string>>(
    () => new Set<string>()
  );

  const [initialLoaded, setInitialLoaded] = useState(false);

  const cardsRef = useRef<StackCard[]>(initialCards);

  const currentIndexRef = useRef(0);

  const loadedCardIdsRef = useRef<Set<string>>(new Set<string>());

  const initialCardIdsRef = useRef<Set<string>>(new Set<string>());

  const prefetchedUrisRef = useRef<Set<string>>(new Set<string>());

  const prefetchingUrisRef = useRef<Set<string>>(new Set<string>());

  const positionMap = useRef<Map<string, Animated.Value>>(new Map()).current;

  cardsRef.current = initialCards;

  const normalizeIndex = (index: number) => {
    const length = cardsRef.current.length;

    if (length === 0) {
      return 0;
    }

    return ((index % length) + length) % length;
  };

  const getCard = (index: number): StackCard | undefined => {
    const cards = cardsRef.current;

    if (cards.length === 0) {
      return undefined;
    }

    return cards[normalizeIndex(index)];
  };

  const getWindowCards = (index: number): WindowCard[] => {
    const result: WindowCard[] = [];

    const usedIds = new Set<string>();

    WINDOW_OFFSETS.forEach((offset) => {
      const card = getCard(index + offset);

      if (!card) {
        return;
      }

      if (usedIds.has(card.id)) {
        return;
      }

      usedIds.add(card.id);

      result.push({
        card,
        offset,
      });
    });

    return result;
  };

  const getPosition = (card: StackCard, initialValue: number) => {
    const current = positionMap.get(card.id);

    if (current) {
      return current;
    }

    const value = new Animated.Value(initialValue);

    positionMap.set(card.id, value);

    return value;
  };

  const resetPositions = (index: number) => {
    const windowCards = getWindowCards(index);

    windowCards.forEach(({ card, offset }) => {
      getPosition(card, offset * cardGap).setValue(offset * cardGap);
    });
  };

  const prefetchAround = (index: number) => {
    const uris = new Set<string>();

    for (let offset = -PREFETCH_RANGE; offset <= PREFETCH_RANGE; offset += 1) {
      const card = getCard(index + offset);

      if (!card) {
        continue;
      }

      if (typeof card.image !== 'string') {
        continue;
      }

      uris.add(card.image);
    }

    uris.forEach((uri) => {
      if (prefetchedUrisRef.current.has(uri)) {
        return;
      }

      if (prefetchingUrisRef.current.has(uri)) {
        return;
      }

      prefetchingUrisRef.current.add(uri);

      Image.prefetch(uri)
        .then((success) => {
          prefetchingUrisRef.current.delete(uri);

          if (!success) {
            return;
          }

          prefetchedUrisRef.current.add(uri);
        })
        .catch(() => {
          prefetchingUrisRef.current.delete(uri);
        });
    });
  };

  const checkInitialLoaded = (loadedIds: Set<string>) => {
    const required = initialCardIdsRef.current;

    if (required.size === 0) {
      return;
    }

    const loaded = [...required].every((id) => loadedIds.has(id));

    if (loaded) {
      setInitialLoaded(true);
    }
  };

  const handleImageLoad = (card: StackCard) => {
    if (loadedCardIdsRef.current.has(card.id)) {
      return;
    }

    const next = new Set(loadedCardIdsRef.current);

    next.add(card.id);

    loadedCardIdsRef.current = next;

    setLoadedCardIds(next);

    checkInitialLoaded(next);
  };

  useEffect(() => {
    currentIndexRef.current = 0;

    loadedCardIdsRef.current = new Set<string>();

    prefetchedUrisRef.current = new Set<string>();

    prefetchingUrisRef.current = new Set<string>();

    positionMap.clear();

    setCurrentIndex(0);

    setLoadedCardIds(new Set<string>());

    setInitialLoaded(false);

    const initialWindow = getWindowCards(0);

    initialCardIdsRef.current = new Set(
      initialWindow.map(({ card }) => card.id)
    );

    if (initialCardIdsRef.current.size === 0) {
      setInitialLoaded(true);
    }

    resetPositions(0);

    prefetchAround(0);
    // Helpers only read refs + cardGap; re-run when cards or gap change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCards, cardGap]);

  useEffect(() => {
    prefetchAround(currentIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const moveCards = (progress: number, direction: number) => {
    const windowCards = getWindowCards(currentIndexRef.current);

    windowCards.forEach(({ card, offset }) => {
      const startY = offset * cardGap;

      const targetY = (offset + direction) * cardGap;

      const y = startY + (targetY - startY) * progress;

      getPosition(card, startY).setValue(y);
    });
  };

  const handleDrag = (dy: number) => {
    if (cardsRef.current.length === 0) {
      return;
    }

    const progress = Math.min(Math.abs(dy) / dragDistance, 1);

    if (dy > 0) {
      moveCards(progress, 1);

      return;
    }

    if (dy < 0) {
      moveCards(progress, -1);
    }
  };

  const returnToOriginalPosition = () => {
    const windowCards = getWindowCards(currentIndexRef.current);

    const animations = windowCards.map(({ card, offset }) =>
      Animated.timing(getPosition(card, offset * cardGap), {
        toValue: offset * cardGap,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    );

    Animated.parallel(animations).start();
  };

  const completePrevious = () => {
    const current = currentIndexRef.current;

    const windowCards = getWindowCards(current);

    const animations = windowCards.map(({ card, offset }) =>
      Animated.timing(getPosition(card, offset * cardGap), {
        toValue: (offset - 1) * cardGap,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    );

    Animated.parallel(animations).start(() => {
      const nextIndex = normalizeIndex(current + 1);

      currentIndexRef.current = nextIndex;

      resetPositions(nextIndex);

      setCurrentIndex(nextIndex);
    });
  };

  const completeNext = () => {
    const current = currentIndexRef.current;

    const windowCards = getWindowCards(current);

    const animations = windowCards.map(({ card, offset }) =>
      Animated.timing(getPosition(card, offset * cardGap), {
        toValue: (offset + 1) * cardGap,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    );

    Animated.parallel(animations).start(() => {
      const nextIndex = normalizeIndex(current - 1);

      currentIndexRef.current = nextIndex;

      resetPositions(nextIndex);

      setCurrentIndex(nextIndex);
    });
  };

  const handleRelease = (dy: number) => {
    if (dy > swipeThreshold) {
      completeNext();

      return;
    }

    if (dy < -swipeThreshold) {
      completePrevious();

      return;
    }

    returnToOriginalPosition();
  };

  const handleDragRef = useRef(handleDrag);

  const handleReleaseRef = useRef(handleRelease);

  const returnToOriginalRef = useRef(returnToOriginalPosition);

  handleDragRef.current = handleDrag;

  handleReleaseRef.current = handleRelease;

  returnToOriginalRef.current = returnToOriginalPosition;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 5 &&
        Math.abs(gestureState.dy) > Math.abs(gestureState.dx),

      onPanResponderMove: (_, gestureState) => {
        handleDragRef.current(gestureState.dy);
      },

      onPanResponderRelease: (_, gestureState) => {
        handleReleaseRef.current(gestureState.dy);
      },

      onPanResponderTerminate: () => {
        returnToOriginalRef.current();
      },
    })
  ).current;

  const windowCards = getWindowCards(currentIndex);

  if (initialCards.length === 0) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {windowCards.map(({ card, offset }) => {
        const translateY = getPosition(card, offset * cardGap);

        const opacity = translateY.interpolate({
          inputRange: [
            -cardGap,
            0,
            (VISIBLE_CARD_COUNT - 1) * cardGap,
            VISIBLE_CARD_COUNT * cardGap,
          ],
          outputRange: [0, 1, 1, 0],
          extrapolate: 'clamp',
        });

        const loaded = loadedCardIds.has(card.id);

        return (
          <Animated.View
            key={card.id}
            style={[
              styles.card,
              {
                transform: [
                  {
                    translateY,
                  },
                ],
                zIndex: offset + 2,
              },
              initialLoaded ? { opacity } : localStyles.hidden,
            ]}
          >
            <CardContent card={card} loaded={loaded} onLoad={handleImageLoad} />
          </Animated.View>
        );
      })}

      {!initialLoaded && (
        <View pointerEvents="auto" style={localStyles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },

  skeleton: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#E5E5E5',
  },

  loading: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },

  hidden: {
    opacity: 0,
  },
});
