import type { ImageSourcePropType } from 'react-native';

/** Local `require(...)` / number, remote `{ uri }`, or plain URL string. */
export type StackCardImage = ImageSourcePropType | string;

export type StackCard = {
  id: string;
  image: StackCardImage;
};

export type CardStackAnimationProps = {
  initialCards: StackCard[];
  cardGap?: number;
  dragDistance?: number;
  swipeThreshold?: number;
};

export type StackCardItemProps = {
  card: StackCard;
  index: number;
  total: number;
};

export type WindowCard = {
  card: StackCard;
  offset: number;
};
