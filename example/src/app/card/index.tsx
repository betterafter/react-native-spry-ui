import type { ImageSourcePropType } from 'react-native';
import { StyleSheet, View } from 'react-native';
import {
  CardStackAnimation,
  // CardWalletAnimation,
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

export default function CardScreen() {
  return (
    <View style={styles.container}>
      <CardStackAnimation
        initialCards={DEMO_CARDS}
        cardGap={80}
        dragDistance={300}
        swipeThreshold={100}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
});
