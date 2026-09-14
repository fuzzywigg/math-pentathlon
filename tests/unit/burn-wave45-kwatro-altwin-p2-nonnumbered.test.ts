/**
 * Wave 45 TOKENMAXX — Kwatro p2 alternative allOnNonNumbered win. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectChip, moveChip } from '../../src/games/kwatro-sinko/rules';

describe('Wave 45 kwatro — p2 alt win', () => {
  it('player2 wins when all own chips leave numbered nodes', () => {
    const open = createInitialState();
    // Move all p2 chips onto non-numbered nodes via forge then one real move
    const nodes = new Map(open.nodes);
    const chips = new Map(open.chips);
    // Clear all p2 from numbered starts onto free non-numbered except one
    const p2Ids = ['p2-0', 'p2-1', 'p2-2', 'p2-3', 'p2-4'];
    const freeNon = [...nodes.values()].filter((n) => !n.isNumbered && !n.chip);
    expect(freeNon.length).toBeGreaterThanOrEqual(5);

    // Place 4 p2 chips already on non-numbered; leave p2-2 to move from start into non-numbered
    for (let i = 0; i < 5; i++) {
      const id = p2Ids[i];
      const chip = chips.get(id)!;
      const old = nodes.get(chip.position!)!;
      nodes.set(old.id, { ...old, chip: null });
    }
    // park 4 chips
    for (let i = 0; i < 4; i++) {
      const id = p2Ids[i];
      const dest = freeNon[i];
      const updated = { ...chips.get(id)!, position: dest.id };
      chips.set(id, updated);
      nodes.set(dest.id, { ...nodes.get(dest.id)!, chip: updated });
    }
    // put p2-2 back on its numbered start with a clear path to freeNon[4]
    const last = chips.get('p2-2')!;
    const startId = open.chips.get('p2-2')!.position!;
    const onStart = { ...last, position: startId };
    chips.set('p2-2', onStart);
    nodes.set(startId, { ...nodes.get(startId)!, chip: onStart });

    const target = freeNon[4].id;
    // ensure connection: if not connected, forge connection
    const startNode = nodes.get(startId)!;
    if (!startNode.connections.includes(target)) {
      nodes.set(startId, {
        ...startNode,
        connections: [...startNode.connections, target],
      });
    }

    let state = {
      ...open,
      nodes,
      chips,
      currentPlayer: 'player2',
      phase: 'selectingChip',
      selectedChip: null,
      winner: null,
    };
    state = selectChip(state, 'p2-2');
    expect(state.phase).toBe('selectingDest');
    const won = moveChip(state, target);
    expect(won.winner).toBe('player2');
    expect(won.phase).toBe('gameOver');
  });
});
