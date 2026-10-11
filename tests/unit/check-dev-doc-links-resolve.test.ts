import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  PATH_RE,
  stripMdLinkTitle,
  stripMdLinkAngleBrackets,
  resolveMdLink,
  matchAllMdLinks,
  symbolInSource,
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

describe('stripMdLinkAngleBrackets (q-mp-1175)', () => {
  it('strips a full <destination> wrap', () => {
    expect(stripMdLinkAngleBrackets('<../wiki/development.md>')).toBe(
      '../wiki/development.md'
    );
    expect(stripMdLinkAngleBrackets('<path with spaces.md>')).toBe(
      'path with spaces.md'
    );
  });

  it('leaves bare destinations unchanged', () => {
    expect(stripMdLinkAngleBrackets('../wiki/development.md')).toBe(
      '../wiki/development.md'
    );
    expect(stripMdLinkAngleBrackets('foo(bar).md')).toBe('foo(bar).md');
    expect(stripMdLinkAngleBrackets('<unclosed')).toBe('<unclosed');
    expect(stripMdLinkAngleBrackets('nope>')).toBe('nope>');
  });
});

describe('matchAllMdLinks (q-mp-1174 + q-mp-1175)', () => {
  it('captures destinations with parentheses in the path (q-mp-1174)', () => {
    const hits = matchAllMdLinks(
      'see [a](file_(draft).md) and [b](foo(bar).md)'
    );
    expect(hits.map((m) => m[1])).toEqual(['file_(draft).md', 'foo(bar).md']);
  });

  it('keeps parenthetical titles in the capture for stripMdLinkTitle', () => {
    const hits = matchAllMdLinks(
      '[t](path.md (title)) [u](foo(bar).md (title with spaces))'
    );
    expect(hits.map((m) => m[1])).toEqual([
      'path.md (title)',
      'foo(bar).md (title with spaces)',
    ]);
    expect(stripMdLinkTitle(hits[0][1])).toBe('path.md');
    expect(stripMdLinkTitle(hits[1][1])).toBe('foo(bar).md');
  });

  it('captures angle-bracket destinations including spaces (q-mp-1175)', () => {
    const hits = matchAllMdLinks(
      '[x](<../wiki/development.md>) [y](<path with spaces.md> "title")'
    );
    expect(hits.map((m) => m[1])).toEqual([
      '<../wiki/development.md>',
      '<path with spaces.md> "title"',
    ]);
  });

  it('still captures plain relative links and quoted titles', () => {
    const hits = matchAllMdLinks(
      '[a](../wiki/development.md) [b](../wiki/development.md "title")'
    );
    expect(hits.map((m) => m[1])).toEqual([
      '../wiki/development.md',
      '../wiki/development.md "title"',
    ]);
  });
});

describe('resolveMdLink (q-mp-1095 + q-mp-1152 + q-mp-1175)', () => {
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

  it('strips <destination> angle brackets before resolving (q-mp-1175)', () => {
    const angled = resolveMdLink(fromDoc, '<../wiki/development.md>');
    expect(angled.skip).toBeUndefined();
    expect(angled.rel).toBe('docs/wiki/development.md');

    const angledTitle = resolveMdLink(
      fromDoc,
      '<../wiki/development.md> "title"'
    );
    expect(angledTitle.skip).toBeUndefined();
    expect(angledTitle.rel).toBe('docs/wiki/development.md');
  });

  it('resolves paren-in-path destinations after matchAllMdLinks (q-mp-1174)', () => {
    // Hermetic: destination path is relative to fromDoc's dir; we only assert
    // the resolved rel shape (file need not exist for resolveMdLink itself).
    const hits = matchAllMdLinks('[x](file_(draft).md)');
    expect(hits).toHaveLength(1);
    const resolved = resolveMdLink(fromDoc, hits[0][1]);
    expect(resolved.skip).toBeUndefined();
    expect(resolved.rel).toBe('docs/dev/file_(draft).md');
  });

  it('skips absolute / external / fragment-only hrefs', () => {
    expect(resolveMdLink(fromDoc, 'https://example.com/a.md').skip).toBe(true);
    expect(resolveMdLink(fromDoc, '#local').skip).toBe(true);
    expect(resolveMdLink(fromDoc, '/absolute/path.md').skip).toBe(true);
    expect(resolveMdLink(fromDoc, 'mailto:a@b.c').skip).toBe(true);
    expect(resolveMdLink(fromDoc, '<https://example.com/a.md>').skip).toBe(
      true
    );
    expect(resolveMdLink(fromDoc, '</absolute/path.md>').skip).toBe(true);
  });
});

describe('symbolInSource (q-mp-1176 export type { Foo })', () => {
  it('detects export type { Sym } and export type { Sym as Alias }', () => {
    expect(symbolInSource('export type { Foo }\n', 'Foo')).toBe(true);
    expect(symbolInSource('export type { Foo, Bar }\n', 'Foo')).toBe(true);
    expect(symbolInSource('export type { Foo, Bar }\n', 'Bar')).toBe(true);
    expect(symbolInSource('export type { Foo as Alias }\n', 'Foo')).toBe(true);
    expect(symbolInSource('export type { Foo as Alias }\n', 'Alias')).toBe(
      true
    );
  });

  it('keeps prior patterns (export type Foo / export { type Foo })', () => {
    expect(symbolInSource('export type Foo = string;\n', 'Foo')).toBe(true);
    expect(symbolInSource('export { type Foo }\n', 'Foo')).toBe(true);
    expect(symbolInSource('export { Foo }\n', 'Foo')).toBe(true);
    expect(symbolInSource('export function Foo() {}\n', 'Foo')).toBe(true);
  });

  it('does not treat // export type { Foo } comments as hits', () => {
    expect(symbolInSource('// export type { Foo }\n', 'Foo')).toBe(false);
    expect(
      symbolInSource('const x = 1;\n// export type { Foo }\n', 'Foo')
    ).toBe(false);
  });

  it('matches live seat-labels SeatId re-export barrel', () => {
    const text = fs.readFileSync('src/ui/seat-labels.ts', 'utf8');
    expect(text).toContain('export type { SeatId }');
    expect(symbolInSource(text, 'SeatId')).toBe(true);
  });
});
