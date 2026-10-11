/**
 * @vitest-environment node
 *
 * Hermetic coverage for scripts/lib/artifact-dir.mjs (q-mp-955).
 * Uses an injectable mkdirSync so CI never needs /opt write access.
 */
import { describe, it, expect } from 'vitest';
import { join, resolve } from 'node:path';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import {
  CLOUD_ARTIFACT_DIR,
  LOCAL_ARTIFACT_DIR,
  artifactPath,
  resolveArtifactDir,
} from '../../scripts/lib/artifact-dir.mjs';

function eacces(path: string): never {
  const err = new Error(`EACCES: permission denied, mkdir '${path}'`);
  (err as NodeJS.ErrnoException).code = 'EACCES';
  throw err;
}

describe('resolveArtifactDir (q-mp-955)', () => {
  it('prefers MP_ARTIFACT_DIR when creatable', () => {
    const created: string[] = [];
    const dir = resolve('/tmp', 'mp-artifact-override');
    const got = resolveArtifactDir({
      env: { MP_ARTIFACT_DIR: dir },
      cwd: '/repo',
      mkdirSync: (p) => {
        created.push(p);
      },
    });
    expect(got).toBe(dir);
    expect(created).toEqual([dir]);
  });

  it('resolves a relative MP_ARTIFACT_DIR against cwd', () => {
    const got = resolveArtifactDir({
      env: { MP_ARTIFACT_DIR: 'custom-out' },
      cwd: '/repo',
      mkdirSync: () => {},
    });
    expect(got).toBe(resolve('/repo', 'custom-out'));
  });

  it('treats blank MP_ARTIFACT_DIR as unset and uses the cloud default', () => {
    const got = resolveArtifactDir({
      env: { MP_ARTIFACT_DIR: '   ' },
      cwd: '/repo',
      mkdirSync: () => {},
    });
    expect(got).toBe(CLOUD_ARTIFACT_DIR);
  });

  it('trims MP_ARTIFACT_DIR before mkdir (q-mp-1263)', () => {
    const created: string[] = [];
    const got = resolveArtifactDir({
      env: { MP_ARTIFACT_DIR: '  spaced  ' },
      cwd: '/tmp',
      mkdirSync: (p) => {
        created.push(p);
      },
    });
    expect(got).toBe(resolve('/tmp', 'spaced'));
    expect(created).toEqual([resolve('/tmp', 'spaced')]);
  });

  it('trims absolute MP_ARTIFACT_DIR before mkdir (q-mp-1263)', () => {
    const created: string[] = [];
    const got = resolveArtifactDir({
      env: { MP_ARTIFACT_DIR: '  /tmp/mp-artifact-trim  ' },
      cwd: '/repo',
      mkdirSync: (p) => {
        created.push(p);
      },
    });
    expect(got).toBe('/tmp/mp-artifact-trim');
    expect(created).toEqual(['/tmp/mp-artifact-trim']);
  });

  it('falls back to repo-local when the cloud root is not creatable', () => {
    const created: string[] = [];
    const got = resolveArtifactDir({
      env: {},
      cwd: '/repo',
      mkdirSync: (p) => {
        if (p === CLOUD_ARTIFACT_DIR) eacces(p);
        created.push(p);
      },
    });
    expect(got).toBe(resolve('/repo', LOCAL_ARTIFACT_DIR));
    expect(created).toEqual([resolve('/repo', LOCAL_ARTIFACT_DIR)]);
  });

  it('falls through when MP_ARTIFACT_DIR is set but not creatable', () => {
    const blocked = resolve('/tmp', 'blocked-artifacts');
    const got = resolveArtifactDir({
      env: { MP_ARTIFACT_DIR: blocked },
      cwd: '/repo',
      mkdirSync: (p) => {
        if (p === blocked || p === CLOUD_ARTIFACT_DIR) eacces(p);
      },
    });
    expect(got).toBe(resolve('/repo', LOCAL_ARTIFACT_DIR));
  });

  it('uses the cloud default when creatable and env is unset', () => {
    const got = resolveArtifactDir({
      env: {},
      cwd: '/repo',
      mkdirSync: () => {},
    });
    expect(got).toBe(CLOUD_ARTIFACT_DIR);
  });
});

describe('artifactPath (q-mp-955)', () => {
  it('joins segments under the resolved artifact root', () => {
    const root = mkdtempSync(join(tmpdir(), 'mp-artifact-path-'));
    const prev = process.env.MP_ARTIFACT_DIR;
    process.env.MP_ARTIFACT_DIR = root;
    try {
      expect(artifactPath('subdir', 'out.json')).toBe(
        join(root, 'subdir', 'out.json')
      );
    } finally {
      if (prev === undefined) {
        delete process.env.MP_ARTIFACT_DIR;
      } else {
        process.env.MP_ARTIFACT_DIR = prev;
      }
      rmSync(root, { recursive: true, force: true });
    }
  });
});
