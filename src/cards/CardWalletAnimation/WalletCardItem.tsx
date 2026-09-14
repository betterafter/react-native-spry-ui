import { Image, View } from 'react-native';
import { CARD_STACK_OFFSET, FRONT_CARD_ROTATION } from './constants';
import { styles } from './styles';
import type { WalletCardItemProps } from './types';
import { resolveCardImage } from './utils';

export default function WalletCardItem({
  card,
  index,
  total,
}: WalletCardItemProps) {
  const isFront = index === total - 1;

  return (
    <View
      style={[
        styles.walletCard,
        {
          zIndex: index + 1,
          elevation: index + 2,
          top: index * CARD_STACK_OFFSET,
          transform: [{ rotate: isFront ? FRONT_CARD_ROTATION : '0deg' }],
        },
      ]}
    >
      <Image
        source={resolveCardImage(card.image)}
        style={styles.walletCardImage}
        resizeMode="cover"
      />
    </View>
  );
}
