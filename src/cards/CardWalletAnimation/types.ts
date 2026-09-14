import type { ImageSourcePropType } from 'react-native';

/** Local `require(...)` / number, remote `{ uri }`, or plain URL string. */
export type WalletCardImage = ImageSourcePropType | string;

export type WalletCard = {
  id: string;
  image: WalletCardImage;
};

export type CardWalletAnimationProps = {
  cards: WalletCard[];
  totalBalance?: string;
};

export type WalletCardItemProps = {
  card: WalletCard;
  index: number;
  total: number;
};
