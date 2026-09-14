export type WalletCardBrand = 'mastercard' | 'visa' | 'paypal';

export type WalletCard = {
  id: string;
  brand: WalletCardBrand;
  amount: string;
};

export type CardWalletAnimationProps = {
  cards?: WalletCard[];
  totalBalance?: string;
};

export type WalletCardItemProps = {
  card: WalletCard;
  index: number;
  total: number;
};
