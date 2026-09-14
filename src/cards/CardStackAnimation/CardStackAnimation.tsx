import { Animated, Easing, PanResponder, View } from 'react-native';
import { useRef, useState } from 'react';

import { styles } from './styles';

import type { CardStackAnimationProps, StackCard } from './types';

import { CARD_GAP, DRAG_DISTANCE, SWIPE_THRESHOLD } from './constants';

const FIRST_PLACEHOLDER = 'firstPlaceholder';
const LAST_PLACEHOLDER = 'lastPlaceholder';

export default function CardStackAnimation({
  initialCards = [],
}: CardStackAnimationProps) {
  const [cards, setCards] = useState(initialCards);

  const cardsRef = useRef(cards);
  cardsRef.current = cards;

  const positionMap = useRef(
    new Map<string, Animated.Value>([
      [FIRST_PLACEHOLDER, new Animated.Value(-CARD_GAP)],

      ...initialCards.map((card, index): [string, Animated.Value] => [
        card.id,
        new Animated.Value(index * CARD_GAP),
      ]),

      [LAST_PLACEHOLDER, new Animated.Value(initialCards.length * CARD_GAP)],
    ])
  ).current;

  const firstPlaceholderPosition = positionMap.get(FIRST_PLACEHOLDER)!;
  const lastPlaceholderPosition = positionMap.get(LAST_PLACEHOLDER)!;

  const getPosition = (card: StackCard) => {
    let value = positionMap.get(card.id);

    if (!value) {
      value = new Animated.Value(0);
      positionMap.set(card.id, value);
    }

    return value;
  };

  const handleNextDrag = (progress: number) => {
    const currentCards = cardsRef.current;

    currentCards.forEach((card, index) => {
      const currentY = index * CARD_GAP;
      const targetY = (index + 1) * CARD_GAP;
      const nextY = currentY + (targetY - currentY) * progress;

      getPosition(card).setValue(nextY);
    });

    const ghostY = -CARD_GAP + CARD_GAP * progress;

    firstPlaceholderPosition.setValue(ghostY);
  };

  const handlePreviousDrag = (progress: number) => {
    const currentCards = cardsRef.current;

    currentCards.forEach((card, index) => {
      const currentY = index * CARD_GAP;
      const targetY = (index - 1) * CARD_GAP;
      const nextY = currentY + (targetY - currentY) * progress;

      getPosition(card).setValue(nextY);
    });

    const ghostY = CARD_GAP - CARD_GAP * progress;

    lastPlaceholderPosition.setValue(ghostY);
  };

  const handleDrag = (dy: number) => {
    const currentCards = cardsRef.current;

    if (currentCards.length === 0) {
      return;
    }

    const progress = Math.min(Math.abs(dy) / DRAG_DISTANCE, 1);

    if (dy > 0) {
      handleNextDrag(progress);
      return;
    }

    handlePreviousDrag(progress);
  };

  const returnToOriginalPosition = () => {
    const currentCards = cardsRef.current;

    Animated.parallel([
      ...currentCards.map((card, index) =>
        Animated.timing(getPosition(card), {
          toValue: index * CARD_GAP,

          duration: 180,

          easing: Easing.out(Easing.cubic),

          useNativeDriver: true,
        })
      ),

      Animated.timing(firstPlaceholderPosition, {
        toValue: -CARD_GAP,

        duration: 180,

        easing: Easing.out(Easing.cubic),

        useNativeDriver: true,
      }),

      Animated.timing(lastPlaceholderPosition, {
        toValue: CARD_GAP,

        duration: 180,

        easing: Easing.out(Easing.cubic),

        useNativeDriver: true,
      }),
    ]).start();
  };

  const completeNext = () => {
    const currentCards = cardsRef.current;

    if (currentCards.length === 0) {
      return;
    }

    Animated.parallel([
      ...currentCards.map((card, index) =>
        Animated.timing(getPosition(card), {
          toValue: (index + 1) * CARD_GAP,

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

      Animated.timing(lastPlaceholderPosition, {
        toValue: CARD_GAP,

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

        nextCards.forEach((card, index) => {
          getPosition(card).setValue(index * CARD_GAP);
        });

        firstPlaceholderPosition.setValue(-CARD_GAP);
        lastPlaceholderPosition.setValue(0);

        return nextCards;
      });
    });
  };

  const completePrevious = () => {
    const currentCards = cardsRef.current;

    if (currentCards.length === 0) {
      return;
    }

    Animated.parallel(
      currentCards.map((card, index) =>
        Animated.timing(getPosition(card), {
          toValue: (index - 1) * CARD_GAP,

          duration: 220,

          easing: Easing.out(Easing.cubic),

          useNativeDriver: true,
        })
      )
    ).start(() => {
      setCards((prevCards) => {
        const firstCard = prevCards[0];

        if (!firstCard) {
          return prevCards;
        }

        const nextCards = [...prevCards.slice(1), firstCard];

        nextCards.forEach((card, index) => {
          getPosition(card).setValue(index * CARD_GAP);
        });

        return nextCards;
      });
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dy) > 5 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
        );
      },

      onPanResponderMove: (_, gestureState) => {
        handleDrag(gestureState.dy);
      },

      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > SWIPE_THRESHOLD) {
          completeNext();
          return;
        }

        if (gestureState.dy < -SWIPE_THRESHOLD) {
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

  const firstCard = cards[0];
  const lastCard = cards[cards.length - 1];

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {lastCard && (
        <Animated.Image
          source={
            typeof lastCard.image === 'string'
              ? {
                  uri: lastCard.image,
                }
              : lastCard.image
          }
          style={[
            styles.card,
            {
              zIndex: cards.length + 1,

              transform: [
                {
                  translateY: firstPlaceholderPosition,
                },
              ],

              opacity: firstPlaceholderPosition.interpolate({
                inputRange: [-CARD_GAP, 0],
                outputRange: [0, 1],
                extrapolate: 'clamp',
              }),
            },
          ]}
        />
      )}

      {cards.map((card, index) => {
        const translateY = getPosition(card);

        const isLast = index === cards.length - 1;

        const opacity = isLast
          ? translateY.interpolate({
              inputRange: [
                (cards.length - 1) * CARD_GAP,
                cards.length * CARD_GAP,
              ],
              outputRange: [1, 0],
              extrapolate: 'clamp',
            })
          : 1;

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
                zIndex: index + CARD_GAP,
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

      {firstCard && (
        <Animated.Image
          source={
            typeof firstCard.image === 'string'
              ? {
                  uri: firstCard.image,
                }
              : firstCard.image
          }
          style={[
            styles.card,
            {
              zIndex: (cards.length + 1) * CARD_GAP,

              transform: [
                {
                  translateY: lastPlaceholderPosition,
                },
              ],

              opacity: lastPlaceholderPosition.interpolate({
                inputRange: [
                  (cards.length - 1) * CARD_GAP,
                  cards.length * CARD_GAP,
                ],
                outputRange: [0, 1],
                extrapolate: 'clamp',
              }),
            },
          ]}
        />
      )}
    </View>
  );
}
