/**
 * Wave 49 — FIAR aria selected label leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { placeChip, selectChip, getSelectableNodes } from '../../src/games/fiar/rules';
import { renderBoard } from '../../src/games/fiar/board-ui';

const SPREAD = ['0-0', '0-4', '4-0', '4-4', '0-2', '4-2', '2-0', '2-4'];

describe('Wave 49 fiar — aria selected', () => {
  it('includes selected in aria-label for selected node', () => {
    let s = createInitialState();
    for (const id of SPREAD) s = placeChip(s, id);
    const own = getSelectableNodes(s)[0]!;
    s = selectChip(s, own);
    const svg = renderBoard(s, () => undefined);
    const label =
      svg.querySelector(`[data-node-id="${own}"]`)?.getAttribute('aria-label') ||
      '';
    expect(label.toLowerCase()).toMatch(/selected/);
  });
});
