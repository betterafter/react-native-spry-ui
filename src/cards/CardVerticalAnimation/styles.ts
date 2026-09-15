import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    shadowColor: '#241F20',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },

  cardContent: {
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 16,
  },
});
