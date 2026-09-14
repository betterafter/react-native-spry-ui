import type { ImageSourcePropType } from 'react-native';
import type { WalletCardImage } from './types';

export function resolveCardImage(image: WalletCardImage): ImageSourcePropType {
  return typeof image === 'string' ? { uri: image } : image;
}
