import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BrandMark from './BrandMark';
import { CARD_STACK_OFFSET, FRONT_CARD_ROTATION } from './constants';
import { styles } from './styles';
import type { WalletCardItemProps } from './types';

export default function WalletCardItem({
  card,
  index,
  total,
}: WalletCardItemProps) {
  const isFront = index === total - 1;
  const amountColor = card.brand === 'paypal' ? '#111' : '#fff';

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
      {card.brand === 'mastercard' && (
        <View style={[styles.walletCardFace, styles.mastercardFace]}>
          <View style={styles.stripeLayer} pointerEvents="none">
            {Array.from({ length: 14 }).map((_, stripeIndex) => (
              <View
                key={stripeIndex}
                style={[styles.stripe, { left: stripeIndex * 28 - 40 }]}
              />
            ))}
          </View>
          <View style={styles.walletCardHeader}>
            <BrandMark brand={card.brand} />
            <Text style={[styles.amount, { color: amountColor }]}>
              {card.amount}
            </Text>
          </View>
        </View>
      )}

      {card.brand === 'visa' && (
        <LinearGradient
          colors={['#F7A8C4', '#8B5CF6', '#3B82F6']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.walletCardFace}
        >
          <View style={styles.walletCardHeader}>
            <BrandMark brand={card.brand} />
            <Text style={[styles.amount, { color: amountColor }]}>
              {card.amount}
            </Text>
          </View>
        </LinearGradient>
      )}

      {card.brand === 'paypal' && (
        <View style={[styles.walletCardFace, styles.paypalFace]}>
          <View style={styles.patternLayer} pointerEvents="none">
            {Array.from({ length: 8 }).map((_, row) => (
              <View key={row} style={styles.patternRow}>
                {Array.from({ length: 10 }).map((__, col) => (
                  <View
                    key={col}
                    style={
                      (row + col) % 2 === 0
                        ? styles.patternDotStrong
                        : styles.patternDotSoft
                    }
                  />
                ))}
              </View>
            ))}
          </View>
          <View style={styles.walletCardHeader}>
            <BrandMark brand={card.brand} />
            <Text style={[styles.amount, { color: amountColor }]}>
              {card.amount}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
