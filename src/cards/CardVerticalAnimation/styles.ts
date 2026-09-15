import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    shadowColor: '#241F20',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },

  cardContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardContent: {
    alignSelf: 'center',
    borderRadius: 16,
  },
});
