import { useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  CardStackAnimation,
  CardVerticalAnimation,
} from 'react-native-spry-ui';

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

const TABS = [
  { key: 'stack', title: 'Card Stack' },
  { key: 'vertical', title: 'Card Vertical' },
] as const;

export default function CardScreen() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {TABS.map((tab, index) => {
          const active = tabIndex === index;

          return (
            <Pressable
              key={tab.key}
              onPress={() => setTabIndex(index)}
              style={styles.tab}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {tab.title}
              </Text>
              {active ? <View style={styles.tabIndicator} /> : null}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.content}>
        {tabIndex === 0 ? (
          <View style={styles.stackWrapper}>
            <CardStackAnimation
              initialCards={DEMO_CARDS}
              cardGap={50}
              dragDistance={300}
              swipeThreshold={100}
            />
          </View>
        ) : (
          <CardVerticalAnimation
            cards={VERTICAL_DEMO_CARD}
            width={250}
            height={250 * 1.586}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.12)',
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },

  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.45)',
  },

  tabLabelActive: {
    color: '#1A1A1A',
    fontWeight: '600',
  },

  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#1A1A1A',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  stackWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
