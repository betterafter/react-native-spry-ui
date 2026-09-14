import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1040',
  },

  walletScene: {
    width: '90%',
    aspectRatio: 16 / 15,
    position: 'relative',
  },

  // z:0 — wallet back shell
  cardBackgroundContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    aspectRatio: 16 / 12,
    backgroundColor: 'black',
    borderRadius: 25,
    zIndex: 0,
    elevation: 0,
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
  },

  // z:1 — cards between shell and pocket
  cardsStack: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 0,
    height: '70%',
    zIndex: 1,
    elevation: 4,
  },

  walletCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    aspectRatio: 16 / 9,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#222',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
  },

  walletCardImage: {
    width: '100%',
    height: '100%',
  },

  // z:2 — front pocket covers lower part of cards
  cardContainer: {
    position: 'absolute',
    left: 4,
    right: 4,
    bottom: 2,
    aspectRatio: 16 / 8,
    borderRadius: 25,
    zIndex: 2,
    elevation: 12,
    overflow: 'hidden',
  },

  cardFace: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },

  cardInnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#241F20',
    aspectRatio: 16 / 8 / 0.95,
    borderRadius: 20,
    overflow: 'hidden',
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

  balanceBlock: {
    position: 'absolute',
    left: 18,
    bottom: 16,
  },

  balanceLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    marginBottom: 4,
  },

  balanceValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
