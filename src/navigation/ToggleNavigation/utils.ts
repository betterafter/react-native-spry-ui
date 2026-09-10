import {
  BAR_GAP,
  BAR_HORIZONTAL_PADDING,
  COLLAPSED_WIDTH,
  LABEL_GAP,
  SELECTED_RIGHT_PADDING,
} from './constants';

export function getExpandedItemWidth(labelWidth: number) {
  return COLLAPSED_WIDTH + LABEL_GAP + labelWidth + SELECTED_RIGHT_PADDING;
}

export function getBarWidth(itemCount: number, activeLabelWidth: number) {
  const expandedItemWidth = getExpandedItemWidth(activeLabelWidth);
  const collapsedItemsWidth = (itemCount - 1) * COLLAPSED_WIDTH;
  const gapsWidth = (itemCount - 1) * BAR_GAP;
  const horizontalPadding = BAR_HORIZONTAL_PADDING * 2;

  return (
    expandedItemWidth + collapsedItemsWidth + gapsWidth + horizontalPadding
  );
}
