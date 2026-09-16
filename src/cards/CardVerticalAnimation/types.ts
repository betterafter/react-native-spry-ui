import type { ImageSourcePropType } from 'react-native';

export type CardImage = ImageSourcePropType | string;

export type VerticalCard = {
  id: string;
  image: CardImage;
};

export type VerticalCardAnimationProps = {
  cards: VerticalCard[];
  width: number;
  height: number;
};

export type WindowCard = {
  card: VerticalCard;
  offset: number;
};
