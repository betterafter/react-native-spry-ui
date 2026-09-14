import type { WalletCard } from './types';

export const DEFAULT_CARDS: WalletCard[] = [
  { id: '1', brand: 'mastercard', amount: '$1,005' },
  { id: '2', brand: 'visa', amount: '$735' },
  { id: '3', brand: 'paypal', amount: '$4,799' },
];

export const DEFAULT_TOTAL_BALANCE = '$6,539.00';

export const CARD_STACK_OFFSET = 42;
export const FRONT_CARD_ROTATION = '2.5deg';
