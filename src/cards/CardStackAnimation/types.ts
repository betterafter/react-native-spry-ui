import type { ImageSourcePropType } from 'react-native';

/** Local `require(...)` / number, remote `{ uri }`, or plain URL string. */
export type StackCardImage = ImageSourcePropType | string;

export type StackCard = {
  id: string;
  image: StackCardImage;
};

export type CardStackAnimationProps = {
  initialCards: StackCard[];
};

export type StackCardItemProps = {
  card: StackCard;
  index: number;
  total: number;
};
