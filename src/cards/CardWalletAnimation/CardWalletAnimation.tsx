import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function CardWalletAnimation() {
  return (
    <View style={styles.screen}>
      <View style={styles.cardBackgroundContainer}>
        <Pressable style={styles.cardContainer}>
          <LinearGradient
            colors={['#373130', '#231516']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.cardContainer}
          >
            <View style={styles.cardInnerContainer}>
              <View style={styles.cardInnerOutCircle}>
                <View style={styles.cardInnerInCircle} />
              </View>
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 25,
  },

  cardBackgroundContainer: {
    justifyContent: 'flex-end',
    width: '90%',
    backgroundColor: 'black',
    paddingHorizontal: 4,
    paddingBottom: 2,
    aspectRatio: 16 / 13,
    borderRadius: 25,
  },

  cardInnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '93%',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#241F20',
    aspectRatio: 16 / 9 / 0.93,
    borderRadius: 20,
  },

  cardInnerOutCircle: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 100,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#373130',
  },

  cardInnerInCircle: {
    width: '80%',
    aspectRatio: 1,
    borderRadius: 100,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#373130',
  },
});
