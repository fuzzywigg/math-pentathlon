/**
 * Harness leftovers in scripts/check-pwa-manifest.mjs (q-mp-1197 + q-mp-1198).
 * Does not exercise scripts/lib/pwa-manifest-contract.mjs helpers.
 */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  collectManifestIconErrors,
  hasSiteWebmanifestLink,
  resolveManifestIconPath,
} from '../../scripts/check-pwa-manifest.mjs';

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

function makeDist(): string {
  const dist = mkdtempSync(join(tmpdir(), 'pwa-manifest-dist-'));
  tempDirs.push(dist);
  return dist;
}

describe('check-pwa-manifest harness: manifest <link> order (q-mp-1197)', () => {
  it('accepts rel-before-href and href-before-rel', () => {
    expect(
      hasSiteWebmanifestLink('<link rel="manifest" href="/site.webmanifest">')
    ).toBe(true);
    expect(
      hasSiteWebmanifestLink('<link href="/site.webmanifest" rel="manifest">')
    ).toBe(true);
    expect(
      hasSiteWebmanifestLink(`<link href='/site.webmanifest' rel='manifest' />`)
    ).toBe(true);
    expect(
      hasSiteWebmanifestLink(
        `<link rel='manifest' href='/assets/site.webmanifest'>`
      )
    ).toBe(true);
  });

  it('rejects missing rel=manifest or wrong href', () => {
    expect(
      hasSiteWebmanifestLink('<link rel="stylesheet" href="/site.webmanifest">')
    ).toBe(false);
    expect(
      hasSiteWebmanifestLink('<link href="/other.json" rel="manifest">')
    ).toBe(false);
    expect(hasSiteWebmanifestLink('')).toBe(false);
  });
});

describe('check-pwa-manifest harness: icon src under dist (q-mp-1198)', () => {
  it('accepts normal root-absolute icons that exist under dist/', () => {
    const dist = makeDist();
    mkdirSync(join(dist, 'icons'), { recursive: true });
    writeFileSync(join(dist, 'icons', 'icon-192.png'), 'png');
    const resolved = resolveManifestIconPath(dist, '/icons/icon-192.png');
    expect(resolved.ok).toBe(true);
    if (resolved.ok) {
      expect(resolved.abs).toBe(join(dist, 'icons', 'icon-192.png'));
    }
    expect(
      collectManifestIconErrors(dist, [{ src: '/icons/icon-192.png' }])
    ).toEqual([]);
  });

  it('rejects traversal that escapes dist/ even when the file exists', () => {
    const dist = makeDist();
    // Sibling file outside dist/ — old path.join(DIST, "../…") could false-pass.
    const outside = join(dist, '..', `escape-icon-${Date.now()}.png`);
    writeFileSync(outside, 'x');
    tempDirs.push(outside);

    const relativeEscape = resolveManifestIconPath(dist, '../escape-icon.png');
    expect(relativeEscape.ok).toBe(false);
    if (!relativeEscape.ok) {
      expect(relativeEscape.error).toMatch(/root-absolute/);
    }

    const absoluteEscape = resolveManifestIconPath(dist, '/../escape-icon.png');
    expect(absoluteEscape.ok).toBe(false);
    if (!absoluteEscape.ok) {
      expect(absoluteEscape.error).toMatch(/escapes dist/);
    }

    const errors = collectManifestIconErrors(dist, [
      { src: '../escape-icon.png' },
      { src: '/../escape-icon.png' },
    ]);
    expect(errors).toHaveLength(2);
    expect(errors[0]).toMatch(/root-absolute/);
    expect(errors[1]).toMatch(/escapes dist/);
  });

  it('rejects scheme-bearing URL src (must not path.join into dist/)', () => {
    const dist = makeDist();
    const https = resolveManifestIconPath(dist, 'https://cdn/x.png');
    expect(https.ok).toBe(false);
    if (!https.ok) {
      expect(https.error).toMatch(/must not be a URL/);
    }
    const protocolRelative = resolveManifestIconPath(dist, '//cdn/x.png');
    expect(protocolRelative.ok).toBe(false);
    if (!protocolRelative.ok) {
      expect(protocolRelative.error).toMatch(/must not be a URL/);
    }
    expect(
      collectManifestIconErrors(dist, [{ src: 'https://cdn/x.png' }])
    ).toEqual([expect.stringMatching(/must not be a URL/)]);
  });

  it('reports missing dist asset for valid root-absolute src', () => {
    const dist = makeDist();
    expect(
      collectManifestIconErrors(dist, [{ src: '/icons/missing.png' }])
    ).toEqual(['missing dist asset for icon /icons/missing.png']);
  });
});
