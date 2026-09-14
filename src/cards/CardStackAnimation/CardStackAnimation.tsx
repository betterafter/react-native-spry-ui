import { ActivityIndicator, Animated, View } from 'react-native';

import { CardContent } from './CardContent';
import { useCardStackAnimation } from './hooks/useCardStackAnimation';
import { styles } from './styles';

import type { CardStackAnimationProps } from './types';

import {
  CARD_GAP,
  DRAG_DISTANCE,
  SWIPE_THRESHOLD,
  VISIBLE_CARD_COUNT,
  WIDTH_SHRINK_PER_LEVEL,
} from './constants';

export default function CardStackAnimation({
  initialCards = [],
  cardGap = CARD_GAP,
  dragDistance = DRAG_DISTANCE,
  swipeThreshold = SWIPE_THRESHOLD,
}: CardStackAnimationProps) {
  const {
    stackWidth,
    setStackWidth,
    windowCards,
    loadedCardIds,
    initialLoaded,
    loadEpoch,
    handleImageLoad,
    getPosition,
    panResponder,
  } = useCardStackAnimation({
    initialCards,
    cardGap,
    dragDistance,
    swipeThreshold,
  });

  if (initialCards.length === 0) {
    return <View style={styles.container} />;
  }

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        setStackWidth(event.nativeEvent.layout.width);
      }}
      {...panResponder.panHandlers}
    >
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

        const frontY = (VISIBLE_CARD_COUNT - 1) * cardGap;
        const scaleX =
          stackWidth > 0
            ? translateY.interpolate({
                inputRange: [0, cardGap, frontY, VISIBLE_CARD_COUNT * cardGap],
                outputRange: [
                  (stackWidth - WIDTH_SHRINK_PER_LEVEL * 2) / stackWidth,
                  (stackWidth - WIDTH_SHRINK_PER_LEVEL) / stackWidth,
                  1,
                  1,
                ],
                extrapolate: 'clamp',
              })
            : 1;

        const loaded = loadedCardIds.has(card.id);

        return (
          <Animated.View
            key={card.id}
            style={[
              styles.card,
              {
                transform: [{ translateY }, { scaleX }],
                zIndex: offset + 2,
              },
              initialLoaded ? { opacity } : styles.hidden,
            ]}
          >
            <CardContent
              key={`${card.id}-${loadEpoch}`}
              card={card}
              loaded={loaded}
              onLoad={handleImageLoad}
            />
          </Animated.View>
        );
      })}

      {!initialLoaded && (
        <View pointerEvents="auto" style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}
