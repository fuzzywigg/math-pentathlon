/**
 * Wave 35 — large deck tray stress + selection churn.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { renderCardTray } from '../../src/core/expressions/expression-ui';
import {
  createExpressionDeck,
  createNumberCard,
} from '../../src/core/expressions/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 35 expr-ui — tray stress', () => {
  it('full default deck renders without dropping cards', () => {
    const deck = createExpressionDeck();
    const tray = renderCardTray(deck);
    expect(tray.querySelectorAll('.expression-card')).toHaveLength(deck.length);
    expect(deck.length).toBeGreaterThanOrEqual(14);
  });

  it('progressive usedIds shrinks tray monotonically', () => {
    const cards = Array.from({ length: 12 }, (_, i) =>
      createNumberCard(i + 1, `n${i}`)
    );
    const used = new Set<string>();
    for (let i = 0; i < cards.length; i++) {
      const tray = renderCardTray(cards, { usedIds: new Set(used) });
      expect(tray.querySelectorAll('.expression-card')).toHaveLength(
        cards.length - i
      );
      used.add(cards[i]!.id);
    }
    expect(
      renderCardTray(cards, { usedIds: used }).querySelectorAll(
        '.expression-card'
      )
    ).toHaveLength(0);
  });

  it('selectedId churn keeps single selected marker', () => {
    const cards = [
      createNumberCard(1, 'a'),
      createNumberCard(2, 'b'),
      createNumberCard(3, 'c'),
    ];
    for (const id of ['a', 'b', 'c']) {
      const tray = renderCardTray(cards, { selectedId: id });
      expect(tray.querySelectorAll('.selected')).toHaveLength(1);
      expect(
        (tray.querySelector('.selected') as HTMLElement).dataset.cardId
      ).toBe(id);
    }
  });
});
