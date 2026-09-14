import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DEFAULT_TOTAL_BALANCE } from './constants';
import { styles } from './styles';
import type { CardWalletAnimationProps } from './types';
import WalletCardItem from './WalletCardItem';

export default function CardWalletAnimation({
  cards,
  totalBalance = DEFAULT_TOTAL_BALANCE,
}: CardWalletAnimationProps) {
  return (
    <View style={styles.screen}>
      <View style={styles.walletScene}>
        <View style={styles.cardBackgroundContainer}>
          <View style={styles.cardsStack} pointerEvents="box-none">
            {cards.map((card, index) => (
              <WalletCardItem
                key={card.id}
                card={card}
                index={index}
                total={cards.length}
              />
            ))}
          </View>

          <Pressable style={styles.cardContainer}>
            <LinearGradient
              colors={['#373130', '#231516']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.cardFace}
            >
              <View style={styles.cardInnerContainer}>
                <View style={styles.cardInnerOutCircle}>
                  <View style={styles.cardInnerInCircle} />
                </View>

                <View style={styles.balanceBlock}>
                  <Text style={styles.balanceLabel}>Total Balance</Text>
                  <Text style={styles.balanceValue}>{totalBalance}</Text>
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
