# q-mp-030b — Hex Hard 450ms + Stars & Bars history-cap recheck (report-only)

**Task id:** `q-mp-030b`  
**Role:** worker (report-only)  
**Repo:** `fuzzywigg/math-pentathlon`  
**Live tip base:** `cursor/mp-tip-post477`  
**Tip HEAD SHA (evidence tree):** `c5927c1392fcb707f63d6c5890ddc294e50b511e`  
**Tip HEAD subject:** `docs(dev): burn-1008 report-only draft index (q-mp-009)`  
**Date:** 2026-10-09  
**Scope:** prove hard rules still hold on live tip — no game-logic edits.

## Acceptance criteria

1. On live tip head, Hex Hard assert stays **450ms** (deadline + unit pin).
2. Stars & Bars history cap is **absent** (full reverse walk; no `slice(-15)`).
3. Evidence quotes with `file:line`; tip SHA recorded.
4. Only file changed in this PR: `docs/dev/mp-hard-assert-recheck-2026-10-09.md`.

## Duplicate check

Open tip drafts (#601–#627 and older) scanned via `gh pr list`. No open draft titled or scoped as `q-mp-030b` / hard-assert recheck. Closest related work is embedded as one row inside broader audits (e.g. `q-mp-002` GO/NO-GO, tip-vs-alpha audit); this deliverable is the dedicated Oct 9 recheck at tip `c5927c13`.

## Verdict

| Hard rule | Result on tip `c5927c13` |
| --- | --- |
| Hex Hard assert stays 450ms | **PASS** |
| No Stars & Bars history cap | **PASS** |

---

## 1. Hex Hard assert stays 450ms

### Source deadline

`src/games/hex/ai.ts:14–21` — comment + `AI_PLAY_DEADLINE_MS.hard`:

```text
 * Hard targets ≤500ms wall think-time (deadline 450ms leaves abort slack;
…
export const AI_PLAY_DEADLINE_MS: Record<AIDifficulty, number> = {
  easy: 600,
  medium: 1200,
  hard: 450,
};
```

Exact line pin:

```text
src/games/hex/ai.ts:21:  hard: 450,
```

### Unit assert

`tests/unit/ai-hard-midgame-identity.test.ts:61–63`:

```text
describe('Hex Hard mid-game time-box identity', () => {
  it('Hard play deadline is ≤450ms (≤500ms wall target)', () => {
    expect(HEX_MS.hard).toBeLessThanOrEqual(450);
```

With tip value `hard: 450`, the pin holds equality at the ceiling (450 ≤ 450).

### Live grep (tip tree)

```bash
rg -n 'hard: 450|toBeLessThanOrEqual\(450\)' src/games/hex/ai.ts tests/unit/ai-hard-midgame-identity.test.ts
```

Observed:

```text
src/games/hex/ai.ts:21:  hard: 450,
tests/unit/ai-hard-midgame-identity.test.ts:63:    expect(HEX_MS.hard).toBeLessThanOrEqual(450);
```

---

## 2. Stars & Bars history cap absent

### UI: uncapped reverse loop

`src/games/stars-bars/board-ui.ts:669–687` — `renderMoveHistory` walks the full array from the end; no trim:

```text
export function renderMoveHistory(state: StarsState): HTMLElement {
  …
  for (let i = state.moveHistory.length - 1; i >= 0; i--) {
    // ratchet: i walks existing indices of moveHistory.
    const move = state.moveHistory[i]!;
    …
    container.appendChild(moveEl);
  }

  return container;
}
```

Exact loop line:

```text
src/games/stars-bars/board-ui.ts:677:  for (let i = state.moveHistory.length - 1; i >= 0; i--) {
```

### Rules: append-only history

`src/games/stars-bars/rules.ts:404` — apply path appends; does not truncate:

```text
    moveHistory: [...state.moveHistory, moveRecord],
```

### Cap signal absent

```bash
rg -n 'slice\(-15\)' src/games/stars-bars
# → no matches (exit 1 / empty)
```

Contrast (not Stars & Bars; shows what a cap looks like elsewhere): `src/games/kings-quadraphages/board-ui.ts` uses `state.moveHistory.slice(-15)` — that pattern is **not** present under `src/games/stars-bars/`.

---

## 3. Files changed (this PR)

| Path | Change |
| --- | --- |
| `docs/dev/mp-hard-assert-recheck-2026-10-09.md` | **added** (this report) |

No edits to `*/rules.ts`, AI search/scoring/timing, player-facing copy, or other open PR branches.

## Next action

**Next action: fold into tip by the tip owner**
