import { Animated, Easing, PanResponder, View } from 'react-native';
import { useRef, useState } from 'react';

import { styles } from './styles';

import type { CardStackAnimationProps, StackCard } from './types';

import { CARD_GAP, DRAG_DISTANCE, SWIPE_THRESHOLD } from './constants';

const FIRST_PLACEHOLDER = 'firstPlaceholder';
const LAST_PLACEHOLDER = 'lastPlaceholder';
const MAX_VISIBLE_CARDS = 3;

export default function CardStackAnimation({
  initialCards = [],
  cardGap = CARD_GAP,
  dragDistance = DRAG_DISTANCE,
  swipeThreshold = SWIPE_THRESHOLD,
}: CardStackAnimationProps) {
  const [cards, setCards] = useState(initialCards);

  const cardsRef = useRef(cards);
  cardsRef.current = cards;

  const positionMap = useRef(
    new Map<string, Animated.Value>([
      [FIRST_PLACEHOLDER, new Animated.Value(-cardGap)],
      ...initialCards.map((card, index): [string, Animated.Value] => [
        card.id,
        new Animated.Value(index * cardGap),
      ]),
      [
        LAST_PLACEHOLDER,
        new Animated.Value(
          Math.min(initialCards.length, MAX_VISIBLE_CARDS) * cardGap
        ),
      ],
    ])
  ).current;

  const firstPlaceholderPosition = positionMap.get(FIRST_PLACEHOLDER)!;

  const lastPlaceholderPosition = positionMap.get(LAST_PLACEHOLDER)!;

  const getVisibleCards = () => cardsRef.current.slice(0, MAX_VISIBLE_CARDS);

  const getPosition = (card: StackCard) => {
    let value = positionMap.get(card.id);

    if (!value) {
      value = new Animated.Value(0);
      positionMap.set(card.id, value);
    }

    return value;
  };

  const handleNextDrag = (progress: number) => {
    const visibleCards = getVisibleCards();

    visibleCards.forEach((card, index) => {
      const currentY = index * cardGap;
      const targetY = (index + 1) * cardGap;
      const nextY = currentY + (targetY - currentY) * progress;

      getPosition(card).setValue(nextY);
    });

    const ghostY = -cardGap + cardGap * progress;

    firstPlaceholderPosition.setValue(ghostY);
  };

  const handlePreviousDrag = (progress: number) => {
    const visibleCards = getVisibleCards();

    visibleCards.forEach((card, index) => {
      const currentY = index * cardGap;
      const targetY = (index - 1) * cardGap;
      const nextY = currentY + (targetY - currentY) * progress;

      getPosition(card).setValue(nextY);
    });

    const startY = visibleCards.length * cardGap;

    const targetY = (visibleCards.length - 1) * cardGap;

    const ghostY = startY + (targetY - startY) * progress;

    lastPlaceholderPosition.setValue(ghostY);
  };

  const handleDrag = (dy: number) => {
    const visibleCards = getVisibleCards();

    if (visibleCards.length === 0) {
      return;
    }

    const progress = Math.min(Math.abs(dy) / dragDistance, 1);

    if (dy > 0) {
      handleNextDrag(progress);
      return;
    }

    handlePreviousDrag(progress);
  };

  const returnToOriginalPosition = () => {
    const visibleCards = getVisibleCards();

    Animated.parallel([
      ...visibleCards.map((card, index) =>
        Animated.timing(getPosition(card), {
          toValue: index * cardGap,
          duration: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      ),

      Animated.timing(firstPlaceholderPosition, {
        toValue: -cardGap,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(lastPlaceholderPosition, {
        toValue: visibleCards.length * cardGap,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const completeNext = () => {
    const currentCards = cardsRef.current;
    const visibleCards = currentCards.slice(0, MAX_VISIBLE_CARDS);

    if (currentCards.length === 0) {
      return;
    }

    Animated.parallel([
      ...visibleCards.map((card, index) =>
        Animated.timing(getPosition(card), {
          toValue: (index + 1) * cardGap,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      ),

      Animated.timing(firstPlaceholderPosition, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCards((prevCards) => {
        const lastCard = prevCards[prevCards.length - 1];

        if (!lastCard) {
          return prevCards;
        }

        const nextCards = [lastCard, ...prevCards.slice(0, -1)];

        nextCards.slice(0, MAX_VISIBLE_CARDS).forEach((card, index) => {
          getPosition(card).setValue(index * cardGap);
        });

        const visibleCount = Math.min(nextCards.length, MAX_VISIBLE_CARDS);

        firstPlaceholderPosition.setValue(-cardGap);

        lastPlaceholderPosition.setValue(visibleCount * cardGap);

        return nextCards;
      });
    });
  };

  const completePrevious = () => {
    const currentCards = cardsRef.current;
    const visibleCards = currentCards.slice(0, MAX_VISIBLE_CARDS);

    if (currentCards.length === 0) {
      return;
    }

    Animated.parallel([
      ...visibleCards.map((card, index) =>
        Animated.timing(getPosition(card), {
          toValue: (index - 1) * cardGap,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      ),

      Animated.timing(lastPlaceholderPosition, {
        toValue: (visibleCards.length - 1) * cardGap,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCards((prevCards) => {
        const firstCard = prevCards[0];

        if (!firstCard) {
          return prevCards;
        }

        const nextCards = [...prevCards.slice(1), firstCard];

        nextCards.slice(0, MAX_VISIBLE_CARDS).forEach((card, index) => {
          getPosition(card).setValue(index * cardGap);
        });

        const visibleCount = Math.min(nextCards.length, MAX_VISIBLE_CARDS);

        firstPlaceholderPosition.setValue(-cardGap);

        lastPlaceholderPosition.setValue(visibleCount * cardGap);

        return nextCards;
      });
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 5 &&
        Math.abs(gestureState.dy) > Math.abs(gestureState.dx),

      onPanResponderMove: (_, gestureState) => {
        handleDrag(gestureState.dy);
      },

      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > swipeThreshold) {
          completeNext();
          return;
        }

        if (gestureState.dy < -swipeThreshold) {
          completePrevious();
          return;
        }

        returnToOriginalPosition();
      },

      onPanResponderTerminate: () => {
        returnToOriginalPosition();
      },
    })
  ).current;

  const visibleCards = cards.slice(0, MAX_VISIBLE_CARDS);

  const visibleCount = visibleCards.length;

  const previousCard = cards[cards.length - 1];

  const nextCard = cards.length > visibleCount ? cards[visibleCount] : cards[0];

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {previousCard && (
        <Animated.Image
          source={
            typeof previousCard.image === 'string'
              ? {
                  uri: previousCard.image,
                }
              : previousCard.image
          }
          style={[
            styles.card,
            {
              zIndex: -(cards.length + 1) * cardGap,
              transform: [
                {
                  translateY: firstPlaceholderPosition,
                },
              ],
              opacity: firstPlaceholderPosition.interpolate({
                inputRange: [-cardGap, 0],
                outputRange: [0, 1],
                extrapolate: 'clamp',
              }),
            },
          ]}
        />
      )}

      {visibleCards.map((card, index) => {
        const translateY = getPosition(card);

        const isFirst = index === 0;

        const isLast = index === visibleCards.length - 1;

        let opacity: number | Animated.AnimatedInterpolation<number> = 1;

        if (isLast) {
          opacity = translateY.interpolate({
            inputRange: [
              (visibleCards.length - 1) * cardGap,
              visibleCards.length * cardGap,
            ],
            outputRange: [1, 0],
            extrapolate: 'clamp',
          });
        }

        if (isFirst) {
          opacity = translateY.interpolate({
            inputRange: [-cardGap, 0],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          });
        }

        return (
          <Animated.Image
            key={card.id}
            source={
              typeof card.image === 'string'
                ? {
                    uri: card.image,
                  }
                : card.image
            }
            style={[
              styles.card,
              {
                zIndex: index,
                transform: [
                  {
                    translateY,
                  },
                ],
                opacity,
              },
            ]}
          />
        );
      })}

      {nextCard && (
        <Animated.Image
          source={
            typeof nextCard.image === 'string'
              ? {
                  uri: nextCard.image,
                }
              : nextCard.image
          }
          style={[
            styles.card,
            {
              zIndex: visibleCount + 1,
              transform: [
                {
                  translateY: lastPlaceholderPosition,
                },
              ],
              opacity: lastPlaceholderPosition.interpolate({
                inputRange: [
                  (visibleCount - 1) * cardGap,
                  visibleCount * cardGap,
                ],
                outputRange: [1, 0],
                extrapolate: 'clamp',
              }),
            },
          ]}
        />
      )}
    </View>
  );
}
