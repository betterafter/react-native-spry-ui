import { CardWalletAnimation } from 'react-native-spry-ui';

const DEMO_CARDS = [
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
  return <CardWalletAnimation cards={DEMO_CARDS} totalBalance="$6,539.00" />;
}
