import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1040',
  },

  cardBackgroundContainer: {
    position: 'relative',
    justifyContent: 'flex-end',
    width: '90%',
    backgroundColor: 'black',
    paddingHorizontal: 4,
    paddingBottom: 2,
    aspectRatio: 16 / 12,
    borderRadius: 25,
    overflow: 'visible',
    zIndex: 0,
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 0,
  },

  cardsStack: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 8,
    height: 220,
    zIndex: 1,
    elevation: 1,
  },

  walletCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 120,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
  },

  walletCardFace: {
    flex: 1,
    borderRadius: 22,
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingTop: 16,
  },

  mastercardFace: {
    backgroundColor: '#0B0B0B',
  },

  paypalFace: {
    backgroundColor: '#F7F7F8',
  },

  walletCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  amount: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  mastercard: {
    width: 42,
    height: 28,
    justifyContent: 'center',
  },

  mastercardCircle: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
  },

  mastercardRed: {
    left: 0,
    backgroundColor: '#EB001B',
  },

  mastercardOrange: {
    left: 16,
    backgroundColor: '#F79E1B',
    opacity: 0.95,
  },

  visaText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    fontStyle: 'italic',
    letterSpacing: 1,
  },

  paypal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  paypalIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#003087',
    alignItems: 'center',
    justifyContent: 'center',
  },

  paypalIconText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },

  paypalText: {
    color: '#003087',
    fontSize: 18,
    fontWeight: '700',
  },

  stripeLayer: {
    ...StyleSheet.absoluteFill,
  },

  stripe: {
    position: 'absolute',
    top: -40,
    width: 14,
    height: 220,
    backgroundColor: '#fff',
    opacity: 0.18,
    transform: [{ rotate: '28deg' }],
  },

  patternLayer: {
    ...StyleSheet.absoluteFill,
    padding: 10,
    justifyContent: 'center',
    gap: 8,
  },

  patternRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  patternDotStrong: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#111',
    opacity: 0.08,
    transform: [{ rotate: '45deg' }],
  },

  patternDotSoft: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#111',
    opacity: 0.03,
    transform: [{ rotate: '45deg' }],
  },

  cardContainer: {
    width: '100%',
    aspectRatio: 16 / 8,
    borderRadius: 25,
    zIndex: 2,
    elevation: 8,
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
