import { Animated, Image, PanResponder, View } from 'react-native';
import type { VerticalCard, VerticalCardAnimationProps } from './types';
import { styles } from './styles';
import usePosition from './hooks/usePosition';
import { CARD_GAP } from './constants';

export default function CardVerticalAnimation({
  cards,
  width,
  height,
}: VerticalCardAnimationProps) {
  const {
    currentPosition,
    nextPosition,
    nextNextPosition,
    animatedSwipePrev,
    animatedSwipeNext,
    currentIndex,
    // swipeNext,
    // swipePrev,
  } = usePosition({ cards, width, height });

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderRelease: (event, state) => {
      //   animatedSwipeNext();
      animatedSwipePrev();
    },
  });

  return (
    <View {...panResponder.panHandlers} style={styles.container}>
      <View style={{ width: width, height: height }}>
        {cards.map((card: VerticalCard, index) => {
          const currentTranslateX = currentPosition;
          const nextTranslateX = nextPosition;
          const nextNextTranslateX = nextNextPosition;

          const currentOpacity = currentTranslateX?.interpolate({
            inputRange: [-CARD_GAP, 0],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          });
          const nextOpacity = nextTranslateX?.interpolate({
            inputRange: [0, CARD_GAP],
            outputRange: [1, 1],
            extrapolate: 'clamp',
          });
          const nextNextOpacity = nextNextTranslateX?.interpolate({
            inputRange: [CARD_GAP, CARD_GAP * 2],
            outputRange: [1, 0],
            extrapolate: 'clamp',
          });

          const currentScale = currentTranslateX?.interpolate({
            inputRange: [-CARD_GAP, 0],
            outputRange: [1, 1],
            extrapolate: 'clamp',
          });
          const nextScale = nextTranslateX?.interpolate({
            inputRange: [0, CARD_GAP],
            outputRange: [1, 0.9],
            extrapolate: 'clamp',
          });
          const nextNextScale = nextTranslateX?.interpolate({
            inputRange: [0, CARD_GAP],
            outputRange: [0.9, 0.9],
            extrapolate: 'clamp',
          });

          const scale =
            index === currentIndex
              ? currentScale
              : index === currentIndex + 1
                ? nextScale
                : nextNextScale;

          const translateX =
            index === currentIndex
              ? currentTranslateX
              : index === currentIndex + 1
                ? nextTranslateX
                : nextNextTranslateX;

          const opacity =
            index === currentIndex
              ? currentOpacity
              : index === currentIndex + 1
                ? nextOpacity
                : nextNextOpacity;

          const zIndex =
            index === currentIndex ? 3 : index === currentIndex + 1 ? 2 : 1;

          return (
            <Animated.View
              key={card.id}
              style={[
                styles.cardContainer,
                translateX
                  ? {
                      transform: [{ translateX }, { scale }],
                      zIndex: zIndex,
                      opacity: opacity,
                    }
                  : {
                      zIndex: zIndex,
                      opacity: opacity,
                    },
              ]}
            >
              <Image
                style={[
                  styles.cardContent,

                  {
                    width: width,
                    height: height,
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
