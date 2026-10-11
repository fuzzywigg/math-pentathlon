/**
 * q-mp-1275 — unique eslint probe config paths for lint:ratchet ↔ lint-buckets.
 * Hermetic path helper only; no ceiling / gate edits.
 */
import { describe, it, expect } from 'vitest';
import { basename, dirname } from 'node:path';
import { makeLintRatchetProbeConfigPath as makeRatchetPath } from '../../scripts/check-lint-ratchet.mjs';
import { makeLintRatchetProbeConfigPath as makeBucketsPath } from '../../scripts/report-lint-buckets.mjs';

describe('makeLintRatchetProbeConfigPath (q-mp-1275)', () => {
  it('places a pid+entropy probe under the given root', () => {
    const p = makeRatchetPath('/tmp/root', 4242, 'abc123');
    expect(dirname(p)).toBe('/tmp/root');
    expect(basename(p)).toBe('.eslint.ratchet.probe.4242.abc123.config.js');
  });

  it('does not use the legacy shared fixed name', () => {
    const a = makeRatchetPath('/repo', 1, 'aaa');
    const b = makeBucketsPath('/repo', 2, 'bbb');
    expect(basename(a)).not.toBe('.eslint.ratchet.probe.config.js');
    expect(basename(b)).not.toBe('.eslint.ratchet.probe.config.js');
    expect(a).not.toBe(b);
  });

  it('ratchet and buckets helpers agree on shape for the same inputs', () => {
    expect(makeRatchetPath('/r', 9, 'deadbeef')).toBe(
      makeBucketsPath('/r', 9, 'deadbeef')
    );
  });

  it('default calls produce distinct paths (entropy)', () => {
    const paths = new Set(
      Array.from({ length: 8 }, () => makeRatchetPath('/repo'))
    );
    expect(paths.size).toBe(8);
  });
});
