/**
 * Undo/redo property tests for polyomino Board — late shard (q-mp-1366).
 * Trials 16..31 of the pre-shard 32-trial random-legal-places case (same seeds).
 * Early trials + product undo live in undo-audit-polyomino-props.test.ts.
 */
import { describe, it } from 'vitest';
import {
  POLYOMINO_RANDOM_LEGAL_LATE_OFFSET,
  POLYOMINO_RANDOM_LEGAL_LATE_TRIALS,
  runPolyominoRandomLegalPlacesAudit,
} from './helpers/undo-audit-polyomino-props';

describe('Undo audit — polyomino removeLast / place redo (late)', () => {
  it('random legal places late: undo N restores; redo replays; placements log matches', () => {
    runPolyominoRandomLegalPlacesAudit({
      trials: POLYOMINO_RANDOM_LEGAL_LATE_TRIALS,
      trialOffset: POLYOMINO_RANDOM_LEGAL_LATE_OFFSET,
    });
  });
});
