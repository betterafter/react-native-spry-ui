import { Text, View } from 'react-native';
import { styles } from './styles';
import type { WalletCardBrand } from './types';

type BrandMarkProps = {
  brand: WalletCardBrand;
};

export default function BrandMark({ brand }: BrandMarkProps) {
  if (brand === 'mastercard') {
    return (
      <View style={styles.mastercard}>
        <View style={[styles.mastercardCircle, styles.mastercardRed]} />
        <View style={[styles.mastercardCircle, styles.mastercardOrange]} />
      </View>
    );
  }

  if (brand === 'visa') {
    return <Text style={styles.visaText}>VISA</Text>;
  }

  return (
    <View style={styles.paypal}>
      <View style={styles.paypalIcon}>
        <Text style={styles.paypalIconText}>P</Text>
      </View>
      <Text style={styles.paypalText}>PayPal</Text>
    </View>
  );
}
