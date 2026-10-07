# State round-trip fuzz — 2026-10-07

Property tests play N random legal moves per game, serialize, deserialize, and
assert deep equality of state, identical legal-move sets, and identical AI
choice under a fixed seed (`tests/unit/state-roundtrip-fuzz.test.ts`).

## Serialization paths under test

| Path | Used for |
|------|----------|
| `serializeGameState` / `deserializeGameState` | Kings & Quadraphages (only dedicated mid-game save codec) |
| Map/Set-aware `JSON.stringify` / `JSON.parse` | All other games (localStorage-shaped mid-game save stand-in) |
| `structuredClone` | Spot-check after each playout (AI worker / in-memory snapshot path) |

On-device progress storage (`src/core/storage`) persists **stats/profile only**,
not in-progress boards. These tests exercise the codecs that would be required
for mid-game resume and the clone path already used by AI workers.

Games with `Map` / `Set` state (`contig-60`, `fab-a-diffy`, `fiar`,
`kwatro-sinko`, `par-55`, `prime-gold`, `queens-guards`, `ramrod`) require a
tagged Map/Set JSON revive (or `structuredClone`). Plain `JSON.stringify`
without revive would drop those collections — that is a **missing mid-game
save codec**, not a live production bug, because the app does not currently
persist boards to `localStorage`.

## Move caps

| Games | Cap | Reason |
|-------|-----|--------|
| Kwatro-Sinko, FIAR | 18 | Movement phases can continue indefinitely |
| All others | 28 | Bound runtime while still exercising mid-game states |

## Coverage

All 20 registered games:

`calla`, `contig-60`, `fab-a-diffy`, `fiar`, `frac-fact`, `fraction-pinball`,
`hex`, `hex-a-gone`, `juggle`, `kings-quadraphages`, `kwatro-sinko`, `par-55`,
`pent-em-in`, `prime-gold`, `queens-guards`, `ramrod`, `remainder-islands`,
`star-track`, `stars-bars`, `sum-dominoes`.

Each game runs two play seeds (`FUZZ_PLAY_SEED` and a second derived seed).

## Findings

**No round-trip bugs found** under the codecs above.

- Kings dedicated serialize/deserialize preserved board, seat, phase, supplies,
  selection, winner, and move history across random legal playouts.
- Map/Set-aware JSON revive preserved structure, legal-move sets, and AI choice
  (seeded AI APIs where available; `Math.random` mocked to a fixed seed
  otherwise) for every other game.
- `structuredClone` after each playout matched the normalized live state.

## Fixes applied

None. No clear serialization bugs required product changes. Rules and scoring
were not modified.
