/**
 * Hermetic structural coverage for check-copy-pins (q-mp-1453…1456):
 * multiline WINDOW_LINES, stripComments line map, wins! registry suffixes,
 * and template-split debris rejection. No tip-wide scan / findings-total stamp.
 *
 * Stays on the default unit-shared project (no vitest.config nodePureFiles edit).
 */
import { describe, expect, it } from 'vitest';
import {
  WINDOW_LINES,
  extractExpectUnit,
  harvestCopyRegistry,
  scanSource,
  stripComments,
} from '../../scripts/check-copy-pins.mjs';

/** Wave-55 shape: four multiline getCurrentPhaseMessage expects (7–8 lines). */
const WAVE55_SHAPE = `/**
 * Header block comment shifts stripped line indexes when newlines are dropped.
 */
import { getCurrentPhaseMessage } from '../../src/games/kings-quadraphages/game-state';

describe('wave55 shape', () => {
  it('Player 2 templates and Player 1 wins game-over', () => {
    const s = { turnPhase: 'moveKing' };
    expect(
      getCurrentPhaseMessage({ ...s, currentPlayer: 'player2', turnPhase: 'moveKing' })
    ).toBe('Player 2: Click your King to select it');
    expect(
      getCurrentPhaseMessage({
        ...s,
        currentPlayer: 'player2',
        turnPhase: 'moveKing',
        selectedKingPosition: { row: 9, col: 5 },
      })
    ).toBe('Player 2: Click a green square to move');
    expect(
      getCurrentPhaseMessage({
        ...s,
        currentPlayer: 'player2',
        turnPhase: 'placeQuadraphage',
      })
    ).toBe('Player 2: Place a Quadraphage');
    expect(
      getCurrentPhaseMessage({
        ...s,
        turnPhase: 'gameOver',
        winner: 'player1',
      })
    ).toBe('Game Over! Player 1 wins!');
  });
});
`;

describe('check-copy-pins structural (q-mp-1453…1456)', () => {
  it('WINDOW_LINES covers 7–8 line phase-message expects (q-mp-1453)', () => {
    expect(WINDOW_LINES).toBeGreaterThanOrEqual(8);

    const stripped = stripComments(WAVE55_SHAPE);
    const lines = stripped.split(/\r?\n/);
    const expectIdx: number[] = [];
    for (let i = 0; i < lines.length; i++) {
      if (/\bexpect\s*\(/.test(lines[i])) expectIdx.push(i);
    }
    expect(expectIdx.length).toBe(4);

    for (const i of expectIdx) {
      const window = lines.slice(i, i + WINDOW_LINES).join('\n');
      expect(extractExpectUnit(window)).not.toBeNull();
    }

    const findings = scanSource('virtual/wave55-shape.ts', WAVE55_SHAPE, []);
    const messageApi = findings.filter((f) => f.kind === 'message-api');
    expect(messageApi.length).toBe(4);
  });

  it('finding.line maps to original expect( after stripComments (q-mp-1454)', () => {
    const source = `/**
 * Leading block comment — must not steal the expect line number.
 */
import { getPhaseMessage } from '../../src/games/calla/rules';
it('pins phase', () => {
  expect(getPhaseMessage(s)).toBe('hi');
});
`;
    const expectLine = source
      .split(/\n/)
      .findIndex((l) => /\bexpect\s*\(/.test(l));
    expect(expectLine).toBeGreaterThan(0);

    const findings = scanSource('virtual/line-map.ts', source, []);
    expect(findings.length).toBeGreaterThanOrEqual(1);
    expect(findings[0]?.kind).toBe('message-api');
    expect(findings[0]?.line).toBe(expectLine + 1);

    // Newlines inside block comments are preserved for the line map.
    const stripped = stripComments(
      '/**\n * a\n * b\n */\nexpect(x).toBe(1);\n'
    );
    expect(stripped.split('\n').length).toBe(6);
    expect(stripped).toMatch(/\n\n\n\nexpect/);
  });

  it('registry keeps wins! suffixes so DOM Blue/Red wins! pins flag (q-mp-1455)', () => {
    const registry = harvestCopyRegistry();
    const winsLike = registry.filter((e) => /^wins!?\.?$/i.test(e.value));
    expect(winsLike.length).toBeGreaterThanOrEqual(1);

    const blue = scanSource(
      'virtual/dom-blue-wins.ts',
      "expect(el.textContent).toBe('Blue wins!');",
      registry
    );
    expect(blue.some((f) => f.kind === 'registry-string')).toBe(true);

    const red = scanSource(
      'virtual/dom-red-wins.ts',
      "expect(status).toBe('Red wins!');",
      registry
    );
    expect(red.some((f) => f.kind === 'registry-string')).toBe(true);
  });

  it('registry ignores template-split debris like remaining) (q-mp-1456)', () => {
    const registry = harvestCopyRegistry();
    expect(registry.some((e) => e.value === 'remaining)')).toBe(false);
    expect(registry.some((e) => /remaining\)\s*$/.test(e.value))).toBe(false);

    const junk = scanSource(
      'virtual/remaining-debris.ts',
      "expect(label).toBe('remaining)');",
      registry
    );
    expect(junk.some((f) => f.kind === 'registry-string')).toBe(false);

    // Real phrase from kings still matches via registry / soft needle.
    const place = scanSource(
      'virtual/place-quad.ts',
      "expect(msg).toBe('Player 2: Place a Quadraphage');",
      registry
    );
    expect(place.some((f) => f.kind === 'registry-string')).toBe(true);
  });
});
