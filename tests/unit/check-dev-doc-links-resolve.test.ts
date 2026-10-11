import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  stripMdLinkTitle,
  resolveMdLink,
  symbolInSource,
} from '../../scripts/check-dev-doc-links.mjs';

const fromDoc = path.resolve('docs/dev/sample.md');

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
