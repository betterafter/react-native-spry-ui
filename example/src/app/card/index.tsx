import type { ImageSourcePropType } from 'react-native';
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
];

export default function CardScreen() {
  return <CardStackAnimation initialCards={DEMO_CARDS} />;
  // return <CardWalletAnimation cards={DEMO_CARDS} totalBalance="$6,539.00" />;
}
