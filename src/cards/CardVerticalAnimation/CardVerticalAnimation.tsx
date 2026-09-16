import { Animated, Image, PanResponder, View } from 'react-native';

import type { VerticalCardAnimationProps } from './types';
import { styles } from './styles';
import usePosition from './hooks/usePosition';
import { CARD_GAP } from './constants';

export default function CardVerticalAnimation({
  cards,
  width,
  height,
}: VerticalCardAnimationProps) {
  const { position, animatedSwipePrev, animatedSwipeNext, currentIndex } =
    usePosition({ cards, width, height });

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderRelease: () => {
      animatedSwipePrev();
    },
  });

  if (cards.length === 0) {
    return null;
  }

  if (cards.length === 1 && cards[0] !== undefined) {
    const card = cards[0];

    return (
      <View style={styles.container}>
        <View style={{ width, height }}>
          <Image
            style={[styles.cardContent, { width, height }]}
            resizeMode="contain"
            source={
              typeof card.image === 'string' ? { uri: card.image } : card.image
            }
          />
        </View>
      </View>
    );
  }

  const visibleCards = [
    cards[currentIndex],
    cards[(currentIndex + 1) % cards.length],
    cards[(currentIndex + 2) % cards.length],
  ];

  return (
    <View {...panResponder.panHandlers} style={styles.container}>
      <View style={{ width, height }}>
        {visibleCards.map((card, slotIndex) => {
          if (!card) {
            return null;
          }

          const translateX = Animated.add(position, slotIndex * CARD_GAP);

          const opacity = translateX.interpolate({
            inputRange: [-CARD_GAP, 0, CARD_GAP, CARD_GAP * 2],
            outputRange: [0, 1, 1, 0],
            extrapolate: 'clamp',
          });

          const scale = translateX.interpolate({
            inputRange: [-CARD_GAP, 0, CARD_GAP, CARD_GAP * 2],
            outputRange: [1, 1, 0.9, 0.8],
            extrapolate: 'clamp',
          });

          const zIndex = 3 - slotIndex;

          return (
            <Animated.View
              key={`${card.id}-${slotIndex}`}
              style={[
                styles.cardContainer,
                {
                  transform: [{ translateX }, { scale }],
                  opacity,
                  zIndex,
                },
              ]}
            >
              <Image
                style={[
                  styles.cardContent,
                  {
                    width,
                    height,
                  },
                ]}
                resizeMode="contain"
                source={
                  typeof card.image === 'string'
                    ? { uri: card.image }
                    : card.image
                }
              />
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}
