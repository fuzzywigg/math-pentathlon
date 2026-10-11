/**
 * Cheap guard: every `npm run <script>` named in developer-facing docs
 * must exist in package.json. No network, no browsers.
 *
 * Glob family mentions (`npm run playtest:*`) must not be treated as a
 * script name — the regex stops at `*`, leaving a trailing-`:` token.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DOC_FILES = [
  'README.md',
  'CONTRIBUTING.md',
  'docs/wiki/development.md',
] as const;

/** Exported for hermetic fixture asserts (and one-liner checks). */
export function extractNpmRunScripts(markdown: string): string[] {
  const found = new Set<string>();
  for (const match of markdown.matchAll(/npm run ([a-zA-Z0-9:_-]+)/g)) {
    const name = match[1]!;
    // Glob shorthand (`npm run foo:*`) captures as `foo:` — ignore it.
    if (name.endsWith(':')) continue;
    found.add(name);
  }
  return [...found].sort();
}

describe('developer docs npm scripts', () => {
  const pkg = JSON.parse(
    readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')
  ) as { scripts: Record<string, string> };
  const defined = new Set(Object.keys(pkg.scripts));

  it.each(DOC_FILES)('%s npm run targets exist in package.json', (relPath) => {
    const markdown = readFileSync(resolve(process.cwd(), relPath), 'utf8');
    const mentioned = extractNpmRunScripts(markdown);
    expect(mentioned.length).toBeGreaterThan(0);
    const missing = mentioned.filter((name) => !defined.has(name));
    expect(missing, `${relPath} references missing scripts`).toEqual([]);
  });

  it('npm test script runs unit then Chromium e2e', () => {
    expect(pkg.scripts.test).toMatch(/test:unit/);
    expect(pkg.scripts.test).toMatch(/test:e2e:chromium/);
  });

  it('ignores npm run playtest:* glob / trailing-colon tokens', () => {
    const mentioned = extractNpmRunScripts(
      'Cheat sheet: `npm run playtest:*` → scripts; also `npm run playtest:calla`.'
    );
    expect(mentioned).toEqual(['playtest:calla']);
    expect(mentioned).not.toContain('playtest:');
  });

  it('still reports genuinely missing script names', () => {
    const mentioned = extractNpmRunScripts(
      'Do not invent `npm run definitely-missing-xyzzy` in docs.'
    );
    expect(mentioned).toEqual(['definitely-missing-xyzzy']);
    expect(defined.has('definitely-missing-xyzzy')).toBe(false);
    const missing = mentioned.filter((name) => !defined.has(name));
    expect(missing).toEqual(['definitely-missing-xyzzy']);
  });
});
