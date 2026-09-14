/**
 * Wave 44 — fab formatMove × sum formatMove handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { formatMove as fabFormat, createInitialState as fabInit } from '../../src/games/fab-a-diffy/rules';
import { formatMove as sumFormat, createInitialState as sumInit } from '../../src/games/sum-dominoes/rules';

describe('Wave 44 handshake — fab × sum formatMove', () => {
  it('both formatters return non-empty descriptive strings', () => {
    const fabState = fabInit();
    const barIds = [...fabState.fractionBars.keys()];
    const answerIds = [...fabState.answerBars.keys()];
    expect(barIds.length).toBeGreaterThanOrEqual(2);
    expect(answerIds.length).toBeGreaterThanOrEqual(1);
    const fabStr = fabFormat(fabState, {
      player: 'player1',
      bar1Id: barIds[0]!,
      bar2Id: barIds[1]!,
      operation: 'add',
      resultId: answerIds[0]!,
      moveNumber: 1,
    });
    expect(fabStr).not.toBe('?');
    expect(fabStr).toContain('=');

    const sumState = sumInit();
    const hand = sumState.hands.player1[0]!;
    const sumStr = sumFormat({
      player: 'player1',
      domino: hand,
      position: { row: 0, col: 0 },
      orientation: 'horizontal',
      matchedFace: hand.face1,
      adjacentFace: 3,
      diceSum: hand.face1 + 3,
      moveNumber: 1,
    });
    expect(sumStr).toContain('|');
    expect(sumStr).toContain(String(hand.face1 + 3));
  });
});
