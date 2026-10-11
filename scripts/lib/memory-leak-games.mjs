/**
 * MEM_LEAK_GAMES / MEM_LEAK_DATE helpers for memory-leak-audit (q-mp-1314, q-mp-1315).
 * Kept free of Playwright / vite so unit tests can import hermetically.
 */

/**
 * Parse MEM_LEAK_GAMES csv into trimmed non-empty ids.
 * @param {string|undefined|null} raw
 * @returns {string[]}
 */
export function parseMemLeakGamesFilter(raw) {
  return String(raw || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Resolve the game list for the audit.
 * Empty filter → all games. Non-empty filter with zero known ids → fail closed.
 * Unknown ids mixed with known ones are dropped (valid subset unchanged).
 *
 * @template {{ id: string }} T
 * @param {string|undefined|null} filterRaw
 * @param {T[]} allGames
 * @returns {{ ok: true, games: T[], filter: string[] } | { ok: false, message: string, filter: string[], games: T[] }}
 */
export function resolveMemLeakGames(filterRaw, allGames) {
  const filter = parseMemLeakGamesFilter(filterRaw);
  if (filter.length === 0) {
    return { ok: true, games: allGames, filter };
  }
  const games = allGames.filter((g) => filter.includes(g.id));
  if (games.length === 0) {
    const known = allGames.map((g) => g.id).join(', ');
    return {
      ok: false,
      message:
        `MEM_LEAK_GAMES matched no known games (got: ${filter.join(',')}).` +
        ` Known ids: ${known}`,
      filter,
      games,
    };
  }
  return { ok: true, games, filter };
}

/**
 * Stamp for docs/memory-leaks-*-DATE.json. Env override wins; else UTC YYYY-MM-DD.
 * @param {string|undefined|null} envDate process.env.MEM_LEAK_DATE
 * @param {Date} [now]
 * @returns {string}
 */
export function resolveMemLeakDate(envDate, now = new Date()) {
  if (envDate) return String(envDate);
  return now.toISOString().slice(0, 10);
}
