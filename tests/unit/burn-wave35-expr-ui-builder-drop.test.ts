/**
 * Wave 35 — renderExpressionBuilder onDrop wiring.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import { renderExpressionBuilder } from '../../src/core/expressions/expression-ui';
import { createSlot } from '../../src/core/expressions/types';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 35 expr-ui — builder drop wiring', () => {
  it('forwards drop cardId from first empty slot', () => {
    const drops: Array<{ index: number; id: string }> = [];
    const el = renderExpressionBuilder(
      { slots: [createSlot(0), createSlot(1)] },
      {
        onDrop: (slot, cardId) => drops.push({ index: slot.index, id: cardId }),
      }
    );
    const slot0 = el.querySelector('.expression-slot') as HTMLElement;
    const drop = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(drop, 'dataTransfer', {
      value: { getData: () => 'dragged-card' },
    });
    slot0.dispatchEvent(drop);
    expect(drops).toEqual([{ index: 0, id: 'dragged-card' }]);
  });
});
