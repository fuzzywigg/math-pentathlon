import path from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  PATH_RE,
  stripMdLinkTitle,
  resolveMdLink,
} from '../../scripts/check-dev-doc-links.mjs';

const fromDoc = path.resolve('docs/dev/sample.md');

describe('PATH_RE (q-mp-1177)', () => {
  /** @param {string} text */
  function matches(text) {
    return [...text.matchAll(PATH_RE)].map((m) => m[1]);
  }

  it('matches .mts and .d.mts backtick paths like .mjs', () => {
    expect(matches('`scripts/check-build.d.mts`')).toEqual([
      'scripts/check-build.d.mts',
    ]);
    expect(matches('`scripts/foo.mts`')).toEqual(['scripts/foo.mts']);
    expect(matches('`scripts/lib/pwa-manifest-contract.d.mts`')).toEqual([
      'scripts/lib/pwa-manifest-contract.d.mts',
    ]);
    expect(matches('`scripts/check-build.mjs`')).toEqual([
      'scripts/check-build.mjs',
    ]);
  });

  it('keeps prior extensions and rejects glob stars in path segment', () => {
    expect(matches('`src/x.ts`')).toEqual(['src/x.ts']);
    expect(matches('`tests/unit/a.tsx`')).toEqual(['tests/unit/a.tsx']);
    expect(matches('`docs/dev/a.md`')).toEqual(['docs/dev/a.md']);
    expect(matches('`scripts/a.json`')).toEqual(['scripts/a.json']);
    expect(matches('`scripts/a.css`')).toEqual(['scripts/a.css']);
    expect(matches('`scripts/a.js`')).toEqual(['scripts/a.js']);
    // Character class omits *; prose globs stay unchecked.
    expect(matches('`scripts/check-*.d.mts`')).toEqual([]);
  });
});

describe('stripMdLinkTitle (q-mp-1095 + q-mp-1152)', () => {
  it('strips double- and single-quoted titles after the path', () => {
    expect(stripMdLinkTitle('../wiki/development.md "title"')).toBe(
      '../wiki/development.md'
    );
    expect(stripMdLinkTitle("../wiki/development.md 'title'")).toBe(
      '../wiki/development.md'
    );
    expect(stripMdLinkTitle('path.md "title with spaces"')).toBe('path.md');
  });

  it('strips CommonMark parenthetical titles after the path (q-mp-1152)', () => {
    expect(stripMdLinkTitle('path.md (title)')).toBe('path.md');
    expect(stripMdLinkTitle('../wiki/development.md (title)')).toBe(
      '../wiki/development.md'
    );
    expect(stripMdLinkTitle('path.md (title with spaces)')).toBe('path.md');
    expect(stripMdLinkTitle('../wiki/development.md#anchor (title)')).toBe(
      '../wiki/development.md#anchor'
    );
  });

  it('leaves untitled destinations unchanged (incl. hash/query)', () => {
    expect(stripMdLinkTitle('../wiki/development.md')).toBe(
      '../wiki/development.md'
    );
    expect(stripMdLinkTitle('../wiki/development.md#anchor')).toBe(
      '../wiki/development.md#anchor'
    );
    expect(stripMdLinkTitle('../wiki/development.md?q=1')).toBe(
      '../wiki/development.md?q=1'
    );
    // Path-internal parens without a title separator stay intact.
    expect(stripMdLinkTitle('foo(bar).md')).toBe('foo(bar).md');
  });
});

describe('resolveMdLink (q-mp-1095 + q-mp-1152)', () => {
  it('resolves titled hrefs to the path without the title segment', () => {
    const doubleQ = resolveMdLink(fromDoc, '../wiki/development.md "title"');
    expect(doubleQ.skip).toBeUndefined();
    expect(doubleQ.rel).toBe('docs/wiki/development.md');

    const singleQ = resolveMdLink(fromDoc, "../wiki/development.md 'title'");
    expect(singleQ.skip).toBeUndefined();
    expect(singleQ.rel).toBe('docs/wiki/development.md');

    const paren = resolveMdLink(fromDoc, '../wiki/development.md (title)');
    expect(paren.skip).toBeUndefined();
    expect(paren.rel).toBe('docs/wiki/development.md');
  });

  it('still strips hash/query after title removal', () => {
    const withHash = resolveMdLink(
      fromDoc,
      '../wiki/development.md#sec "title"'
    );
    expect(withHash.skip).toBeUndefined();
    expect(withHash.rel).toBe('docs/wiki/development.md');

    const withQuery = resolveMdLink(
      fromDoc,
      '../wiki/development.md?x=1 "title"'
    );
    expect(withQuery.skip).toBeUndefined();
    expect(withQuery.rel).toBe('docs/wiki/development.md');

    const parenHash = resolveMdLink(
      fromDoc,
      '../wiki/development.md#sec (title)'
    );
    expect(parenHash.skip).toBeUndefined();
    expect(parenHash.rel).toBe('docs/wiki/development.md');
  });

  it('skips absolute / external / fragment-only hrefs', () => {
    expect(resolveMdLink(fromDoc, 'https://example.com/a.md').skip).toBe(true);
    expect(resolveMdLink(fromDoc, '#local').skip).toBe(true);
    expect(resolveMdLink(fromDoc, '/absolute/path.md').skip).toBe(true);
    expect(resolveMdLink(fromDoc, 'mailto:a@b.c').skip).toBe(true);
  });
});
