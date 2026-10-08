import { describe, expect, it } from 'vitest';
import {
  formatModeSeatLabel,
  formatModeSeatLabelComputer,
  getOpponentSeat,
  getPlayerName,
} from '../../src/ui/seat-labels';

/**
 * Structural seat-label pins only — never assert the player-facing words
 * themselves (Blue/Red/You/AI/Computer).
 */
describe('mutation-ui2 seat-labels (no copy assertions)', () => {
  it('default vsAI flag is false (same as explicit false)', () => {
    expect(getPlayerName('player1')).toBe(getPlayerName('player1', false));
    expect(getPlayerName('player2')).toBe(getPlayerName('player2', false));
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player1', true));
    expect(getPlayerName('player2')).not.toBe(getPlayerName('player2', true));
  });

  it('cross-helper seat branches stay aligned (still no raw copy asserts)', () => {
    // Ties getPlayerName seat checks to formatMode* without naming the strings.
    expect(getPlayerName('player1', false)).toBe(
      formatModeSeatLabel('player1', 'human-vs-human')
    );
    expect(getPlayerName('player2', false)).toBe(
      formatModeSeatLabel('player2', 'human-vs-human')
    );
    expect(getPlayerName('player1', true)).toBe(
      formatModeSeatLabel('player1', 'human-vs-ai')
    );
    expect(getPlayerName('player2', true)).toBe(
      formatModeSeatLabelComputer('player2', 'human-vs-ai')
    );
  });

  it('seats and modes yield distinct labels where the branch differs', () => {
    expect(getPlayerName('player1', false)).not.toBe(
      getPlayerName('player2', false)
    );
    expect(getPlayerName('player1', true)).not.toBe(
      getPlayerName('player2', true)
    );

    expect(formatModeSeatLabel('player1', 'human-vs-human')).not.toBe(
      formatModeSeatLabel('player2', 'human-vs-human')
    );
    expect(formatModeSeatLabel('player1', 'human-vs-ai')).not.toBe(
      formatModeSeatLabel('player2', 'human-vs-ai')
    );
    expect(formatModeSeatLabel('player2', 'human-vs-ai')).not.toBe(
      formatModeSeatLabel('player2', 'human-vs-human')
    );
    expect(formatModeSeatLabel('player1', 'human-vs-ai')).not.toBe(
      formatModeSeatLabel('player1', 'human-vs-human')
    );
  });

  it('Computer vs AI mode helpers diverge only on the AI seat', () => {
    expect(formatModeSeatLabel('player1', 'human-vs-ai')).toBe(
      formatModeSeatLabelComputer('player1', 'human-vs-ai')
    );
    expect(formatModeSeatLabel('player2', 'human-vs-ai')).not.toBe(
      formatModeSeatLabelComputer('player2', 'human-vs-ai')
    );
    expect(formatModeSeatLabel('player2', 'human-vs-human')).toBe(
      formatModeSeatLabelComputer('player2', 'human-vs-human')
    );
  });

  it('re-exports opponent flip from core/seats', () => {
    expect(getOpponentSeat('player1')).toBe('player2');
    expect(getOpponentSeat('player2')).toBe('player1');
  });
});
