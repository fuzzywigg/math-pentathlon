import path from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  stripMdLinkTitle,
  resolveMdLink,
} from '../../scripts/check-dev-doc-links.mjs';

const fromDoc = path.resolve('docs/dev/sample.md');

describe('stripMdLinkTitle (q-mp-1095)', () => {
  it('strips double- and single-quoted titles after the path', () => {
    expect(stripMdLinkTitle('../wiki/development.md "title"')).toBe(
      '../wiki/development.md'
    );
    expect(stripMdLinkTitle("../wiki/development.md 'title'")).toBe(
      '../wiki/development.md'
    );
    expect(stripMdLinkTitle('path.md "title with spaces"')).toBe('path.md');
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
  });
});

describe('resolveMdLink (q-mp-1095)', () => {
  it('resolves titled hrefs to the path without the title segment', () => {
    const doubleQ = resolveMdLink(fromDoc, '../wiki/development.md "title"');
    expect(doubleQ.skip).toBeUndefined();
    expect(doubleQ.rel).toBe('docs/wiki/development.md');

    const singleQ = resolveMdLink(fromDoc, "../wiki/development.md 'title'");
    expect(singleQ.skip).toBeUndefined();
    expect(singleQ.rel).toBe('docs/wiki/development.md');
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
  });

  it('skips absolute / external / fragment-only hrefs', () => {
    expect(resolveMdLink(fromDoc, 'https://example.com/a.md').skip).toBe(true);
    expect(resolveMdLink(fromDoc, '#local').skip).toBe(true);
    expect(resolveMdLink(fromDoc, '/absolute/path.md').skip).toBe(true);
    expect(resolveMdLink(fromDoc, 'mailto:a@b.c').skip).toBe(true);
  });
});
