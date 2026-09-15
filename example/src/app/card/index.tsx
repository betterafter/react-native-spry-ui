import { useState } from 'react';
import type {
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  CardStackAnimation,
  CardVerticalAnimation,
} from 'react-native-spry-ui';

const { width: PAGE_WIDTH } = Dimensions.get('window');

const DEMO_CARDS: { id: string; image: ImageSourcePropType }[] = [
  {
    id: '1',
    image: require('../../../assets/cards/card-mastercard.png'),
  },
  {
    id: '2',
    image: require('../../../assets/cards/card-visa.png'),
  },
  {
    id: '3',
    image: require('../../../assets/cards/card-paypal.png'),
  },
  {
    id: '4',
    image: require('../../../assets/cards/card-amex.png'),
  },
  {
    id: '5',
    image: require('../../../assets/cards/card-apple.png'),
  },
];

const VERTICAL_DEMO_CARD: { id: string; image: ImageSourcePropType }[] = [
  {
    id: '1',
    image: require('../../../assets/cards/card-vertical-mastercard.png'),
  },
  {
    id: '2',
    image: require('../../../assets/cards/card-vertical-visa.png'),
  },
  {
    id: '3',
    image: require('../../../assets/cards/card-vertical-paypal.png'),
  },
  {
    id: '4',
    image: require('../../../assets/cards/card-vertical-amex.png'),
  },
  {
    id: '5',
    image: require('../../../assets/cards/card-vertical-apple.png'),
  },
];

const PAGES = [
  {
    key: 'stack',
    title: 'Card Stack',
    backgroundColor: '#F5F5F5',
  },

  {
    key: 'vertical',
    title: 'Card Vertical',
    backgroundColor: '#F5F5F5',
  },
] as const;

export default function CardScreen() {
  const { width } = useWindowDimensions();
  const [pageIndex, setPageIndex] = useState(0);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setPageIndex(nextIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        bounces={false}
        style={styles.pager}
        contentContainerStyle={styles.pagerContent}
      >
        <View
          style={[styles.page, { backgroundColor: PAGES[0].backgroundColor }]}
        >
          <Text style={[styles.title, styles.titleDark]}>{PAGES[0].title}</Text>
          <View style={styles.stackWrapper}>
            <CardStackAnimation
              initialCards={DEMO_CARDS}
              cardGap={50}
              dragDistance={300}
              swipeThreshold={100}
            />
          </View>
        </View>

        <View
          style={[styles.page, { backgroundColor: PAGES[1].backgroundColor }]}
        >
          <Text style={[styles.title, styles.titleDark]}>{PAGES[1].title}</Text>
          <CardVerticalAnimation
            cards={VERTICAL_DEMO_CARD}
            width={250}
            height={250 * 1.586}
          />
        </View>
      </ScrollView>

      <View style={styles.dots} pointerEvents="none">
        {PAGES.map((page, index) => {
          const onDark = pageIndex === 1;
          const active = pageIndex === index;

          return (
            <View
              key={page.key}
              style={[
                styles.dot,
                onDark && styles.dotOnDark,
                active && (onDark ? styles.dotActiveOnDark : styles.dotActive),
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  pager: {
    flex: 1,
  },

  pagerContent: {
    flexGrow: 1,
  },

  page: {
    width: PAGE_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    position: 'absolute',
    top: 24,
    zIndex: 1,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  titleDark: {
    color: '#1A1A1A',
  },

  titleLight: {
    color: '#FFFFFF',
  },

  stackWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dots: {
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },

  dotActive: {
    width: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },

  dotOnDark: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  dotActiveOnDark: {
    width: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});
