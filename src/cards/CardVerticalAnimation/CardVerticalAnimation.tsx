import { Animated, Image, PanResponder, View } from 'react-native';

import type { VerticalCardAnimationProps } from './types';
import { styles } from './styles';
import usePosition from './hooks/usePosition';
import { CARD_GAP, VISIBLE_CARD_COUNT } from './constants';

export default function CardVerticalAnimation({
  cards,
  width,
  height,
}: VerticalCardAnimationProps) {
  const { windowCards, getPosition, animatedSwipePrev, animatedSwipeNext } =
    usePosition({
      cards,
      width,
      height,
    });

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderRelease: (_, state) => {
      if (state.dx < 0) {
        animatedSwipeNext();
      }

      if (state.dx > 0) {
        animatedSwipePrev();
      }
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
            fadeDuration={0}
            source={
              typeof card.image === 'string' ? { uri: card.image } : card.image
            }
          />
        </View>
      </View>
    );
  }

  return (
    <View {...panResponder.panHandlers} style={styles.container}>
      <View style={{ width, height }}>
        {windowCards.map(({ card, offset }) => {
          const translateX = getPosition(card.id, offset * CARD_GAP);

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

          return (
            <Animated.View
              key={card.id}
              style={[
                styles.cardContainer,
                {
                  transform: [{ translateX }, { scale }],
                  opacity,
                  zIndex:
                    offset === -1
                      ? VISIBLE_CARD_COUNT + 1
                      : VISIBLE_CARD_COUNT - offset,
                },
              ]}
            >
              <Image
                style={[styles.cardContent, { width, height }]}
                resizeMode="contain"
                fadeDuration={0}
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
