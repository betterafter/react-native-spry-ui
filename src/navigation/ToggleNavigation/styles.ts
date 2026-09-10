import { StyleSheet } from 'react-native';

import {
  BAR_GAP,
  BAR_HORIZONTAL_PADDING,
  COLLAPSED_WIDTH,
  LABEL_GAP,
} from './constants';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: BAR_HORIZONTAL_PADDING,
    gap: BAR_GAP,
    borderRadius: 100,
    backgroundColor: '#1D1F1E',
    overflow: 'hidden',
  },

  item: {
    height: COLLAPSED_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    overflow: 'hidden',
    flexShrink: 0,
  },

  selectedItem: {
    backgroundColor: 'white',
  },

  unselectedItem: {
    backgroundColor: '#2F3231',
  },

  iconSlot: {
    width: COLLAPSED_WIDTH,
    height: COLLAPSED_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  labelContainer: {
    marginLeft: LABEL_GAP,
    overflow: 'hidden',
    flexShrink: 0,
  },

  labelText: {
    fontSize: 14,
    color: '#2B2E2D',
  },

  selectedText: {
    color: '#2B2E2D',
  },

  unselectedText: {
    color: '#CDCFCE',
  },

  measureContainer: {
    position: 'absolute',
    left: -10000,
    top: -10000,
    opacity: 0,
  },
});
