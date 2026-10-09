/**
 * q-mp-231 mutation audit UI wave 6 — kill survivors in games/kwatro-sinko/board-ui.
 * Structural / radius / input-guard pins only — no player-facing copy asserts.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';
import {
  createInitialState,
  getValidMoves,
} from '../../src/games/kwatro-sinko/rules';
import type { BoardNode, KwaState } from '../../src/games/kwatro-sinko/types';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('mutation-ui6 kwatro board-ui', () => {
  it('locks NODE_RADIUS 22 and CHIP_RADIUS 18 (kills ±1)', () => {
    // Survivors: L22 22→23/21, L23 18→19/17.
    const base = createInitialState();
    const chip = [...base.chips.values()].find((c) => c.owner === 'player1')!;
    const state = { ...base, selectedChip: chip.id };
    const el = renderBoard(
      state,
      () => undefined,
      () => undefined
    );
    const chipHost = el.querySelector(`[data-node-id="${chip.position}"]`);
    const chipCircles = [...(chipHost?.querySelectorAll('circle') ?? [])];
    // Node circle (r=22) + chip fill (r=18) + selection ring (r=22, fill none).
    const chipFill = chipCircles.find(
      (c) =>
        c.getAttribute('stroke') === '#333' && c.getAttribute('fill') !== 'none'
    );
    expect(chipFill?.getAttribute('r')).toBe('18');
    const ring = chipCircles.find(
      (c) =>
        c.getAttribute('fill') === 'none' &&
        c.getAttribute('stroke') === '#ff9800'
    );
    expect(ring?.getAttribute('r')).toBe('22'); // CHIP_RADIUS + 4

    const emptyNode = [...state.nodes.values()].find((n) => !n.chip)!;
    const emptyHost = el.querySelector(`[data-node-id="${emptyNode.id}"]`);
    const nodeCircle = emptyHost?.querySelector('circle');
    expect(nodeCircle?.getAttribute('r')).toBe('22');
  });

  it('allowInput false suppresses valid-move chrome even with selection', () => {
    // Survivors: L36 false→true on !== false; L51 allowInput && selectedChip → ||.
    const base = createInitialState();
    const chipId = [...base.chips.keys()].find(
      (id) => base.chips.get(id)?.owner === 'player1'
    )!;
    const state = { ...base, selectedChip: chipId };
    expect(getValidMoves(state, chipId).length).toBeGreaterThan(0);
    const el = renderBoard(
      state,
      () => undefined,
      () => undefined,
      {
        allowInput: false,
      }
    );
    expect(el.querySelectorAll('.kwa-valid-node').length).toBe(0);
  });

  it('allowInput true keeps selectable chip chrome (guards !== true mutant)', () => {
    const base = createInitialState();
    const state = { ...base, phase: 'selectingChip' as const };
    const el = renderBoard(
      state,
      () => undefined,
      () => undefined,
      {
        allowInput: true,
      }
    );
    expect(el.querySelectorAll('.kwa-selectable-chip').length).toBeGreaterThan(
      0
    );
  });

  it('invalid empty nodes do not fire onNodeClick (kills isValid && !chip → ||)', () => {
    // Survivor: L151 Logical isValid && !node.chip → ||.
    const state = createInitialState();
    const onNode = vi.fn();
    const el = renderBoard(state, onNode, () => undefined);
    // No selection → no valid moves; every empty node is invalid for placement.
    const empty = [...state.nodes.values()].find((n) => !n.chip)!;
    const host = el.querySelector(`[data-node-id="${empty.id}"]`);
    host?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onNode).not.toHaveBeenCalled();
  });

  it('valid empty destination fires onNodeClick (kills remove ! on !node.chip)', () => {
    // Survivor: L151 UnaryNot remove ! — becomes isValid && node.chip.
    const base = createInitialState();
    const chipId = [...base.chips.keys()].find(
      (id) => base.chips.get(id)?.owner === 'player1'
    )!;
    const state = { ...base, selectedChip: chipId };
    const emptyValid = getValidMoves(state, chipId).find(
      (id) => !state.nodes.get(id)?.chip
    );
    expect(emptyValid).toBeTruthy();
    const onNode = vi.fn();
    const el = renderBoard(state, onNode, () => undefined);
    const host = el.querySelector(`[data-node-id="${emptyValid!}"]`);
    host?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onNode).toHaveBeenCalledWith(emptyValid);
  });

  it('data-row/data-col parse asymmetric nR-C ids (kills match?.[1]/[2] ±1)', () => {
    // Survivors: L113/L114 NumericBoundary on match?.[1] / match?.[2] indices.
    // Require row !== col so swapping indices is observable.
    const state = createInitialState();
    const sample = [...state.nodes.values()].find((n) => {
      const m = /^n(\d+)-(\d+)$/.exec(n.id);
      return m != null && m[1] !== m[2];
    });
    expect(sample).toBeTruthy();
    const m = /^n(\d+)-(\d+)$/.exec(sample!.id)!;
    const el = renderBoard(
      state,
      () => undefined,
      () => undefined
    );
    const host = el.querySelector(`[data-node-id="${sample!.id}"]`);
    expect(host?.getAttribute('data-row')).toBe(m[1]);
    expect(host?.getAttribute('data-col')).toBe(m[2]);
    expect(host?.getAttribute('data-row')).not.toBe(
      host?.getAttribute('data-col')
    );
  });

  it('non-matching node id falls back to data-row/col 0 (kills fallback ±1)', () => {
    const base = createInitialState();
    const odd: BoardNode = {
      id: 'orphan',
      x: 10,
      y: 10,
      connections: [],
      isNumbered: false,
      chip: null,
    };
    const nodes = new Map(base.nodes);
    nodes.set(odd.id, odd);
    const state = { ...base, nodes } as KwaState;
    const el = renderBoard(
      state,
      () => undefined,
      () => undefined
    );
    const host = el.querySelector('[data-node-id="orphan"]');
    expect(host?.getAttribute('data-row')).toBe('0');
    expect(host?.getAttribute('data-col')).toBe('0');
  });

  it('edge line count equals undirected half-sum (documents > → >=)', () => {
    // L59 connId > node.id → >= is equivalent without self-loops; pin half-sum.
    const state = createInitialState();
    let half = 0;
    for (const node of state.nodes.values()) {
      half += node.connections.length;
    }
    half = half / 2;
    const el = renderBoard(
      state,
      () => undefined,
      () => undefined
    );
    expect(el.querySelectorAll('line').length).toBe(half);
  });
});
