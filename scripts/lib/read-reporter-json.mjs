/**
 * Safe reporter-JSON loader for flake-rate loops (q-mp-1024, q-mp-1153, q-mp-1321).
 *
 * Missing / unreadable / corrupt files and JSON null / array / non-object
 * roots return `{ ok: false, error }` and never throw — so a bad
 * Vitest/Playwright JSON artifact cannot abort the loop or silently under-count.
 * Leading UTF-8 BOM (U+FEFF) is stripped before parse so editor/tool-prefixed
 * JSON is accepted without changing schema checks.
 */
import fs from 'node:fs';

/**
 * @param {string} jsonPath
 * @param {{ existsSync?: typeof fs.existsSync, readFileSync?: typeof fs.readFileSync }} [io]
 * @returns {{ ok: true, data: Record<string, unknown> } | { ok: false, error: string }}
 */
export function readReporterJson(jsonPath, io = {}) {
  const existsSync = io.existsSync ?? fs.existsSync;
  const readFileSync = io.readFileSync ?? fs.readFileSync;
  if (!existsSync(jsonPath)) {
    return { ok: false, error: 'missing json' };
  }
  let raw;
  try {
    raw = readFileSync(jsonPath, 'utf8');
  } catch {
    return { ok: false, error: 'unreadable json' };
  }
  // Strip a single leading UTF-8 BOM (q-mp-1321). Mid-file FEFF is left alone.
  if (raw.charCodeAt(0) === 0xfeff) {
    raw = raw.slice(1);
  }
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return { ok: false, error: 'corrupt json' };
  }
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, error: 'non-object json root' };
  }
  return { ok: true, data };
}
