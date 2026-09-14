import { WINDOW_OFFSETS } from './constants';

import type { StackCard, WindowCard } from './types';

export function isLocalAsset(image: StackCard['image']) {
  return typeof image === 'number';
}

export function normalizeIndex(index: number, length: number) {
  if (length === 0) {
    return 0;
  }

  return ((index % length) + length) % length;
}

export function getCard(
  cards: StackCard[],
  index: number
): StackCard | undefined {
  if (cards.length === 0) {
    return undefined;
  }

  return cards[normalizeIndex(index, cards.length)];
}

export function getWindowCards(
  cards: StackCard[],
  index: number
): WindowCard[] {
  const result: WindowCard[] = [];
  const usedIds = new Set<string>();

  WINDOW_OFFSETS.forEach((offset) => {
    const card = getCard(cards, index + offset);

    if (!card) {
      return;
    }

    if (usedIds.has(card.id)) {
      return;
    }

    usedIds.add(card.id);

    result.push({
      card,
      offset,
    });
  });

  return result;
}
