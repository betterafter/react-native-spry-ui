import { VISIBLE_CARD_COUNT } from './constants';

import type { VerticalCard, WindowCard } from './types';

export function getWindowCards(
  cards: VerticalCard[],
  index: number
): WindowCard[] {
  if (cards.length === 0) {
    return [];
  }

  const result: WindowCard[] = [];
  const used = new Set<string>();

  for (let offset = 0; offset < VISIBLE_CARD_COUNT; offset += 1) {
    const card = cards[(index + offset) % cards.length];

    if (!card || used.has(card.id)) {
      continue;
    }

    used.add(card.id);
    result.push({ card, offset });
  }

  return result;
}
