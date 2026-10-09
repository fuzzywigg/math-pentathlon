/**
 * q-mp-279 — pin CI least-privilege: permissions.contents: read and
 * every actions/checkout persist-credentials: false. Report-only audit;
 * does not edit workflow behavior.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import yaml from 'js-yaml';
import { auditWorkflowsDir } from '../../scripts/check-workflows.mjs';

const WORKFLOWS_DIR = resolve(process.cwd(), '.github/workflows');

const CI_JOBS = [
  'lint',
  'audit',
  'build',
  'unit',
  'e2e',
  'e2e-fullgame',
  'mobile-touch',
  'zoom-reflow',
  'forced-colors',
  'e2e-cross-browser',
  'knip',
  'visual-baseline',
] as const;

type WorkflowDoc = {
  permissions?: Record<string, unknown>;
  jobs?: Record<string, { steps?: Array<{ uses?: string; with?: Record<string, unknown> }> }>;
};

function loadWorkflow(name: string): { raw: string; doc: WorkflowDoc } {
  const raw = readFileSync(join(WORKFLOWS_DIR, name), 'utf8');
  const doc = yaml.load(raw) as WorkflowDoc;
  return { raw, doc };
}

function checkoutPersistFlags(doc: WorkflowDoc): boolean[] {
  const flags: boolean[] = [];
  for (const job of Object.values(doc.jobs ?? {})) {
    for (const step of job.steps ?? []) {
      if (typeof step.uses === 'string' && step.uses.startsWith('actions/checkout@')) {
        flags.push(step.with?.['persist-credentials'] === false);
      }
    }
  }
  return flags;
}

describe('q-mp-279 CI permissions / persist-credentials pins', () => {
  it('workflows dir has only ci.yml and deploy.yml', () => {
    const files = readdirSync(WORKFLOWS_DIR)
      .filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'))
      .sort();
    expect(files).toEqual(['ci.yml', 'deploy.yml']);
  });

  it('ci.yml pins contents: read and 12× persist-credentials: false', () => {
    const { raw, doc } = loadWorkflow('ci.yml');

    expect(doc.permissions).toEqual({ contents: 'read' });
    expect(Object.keys(doc.jobs ?? {}).sort()).toEqual([...CI_JOBS].sort());

    const persistFlags = checkoutPersistFlags(doc);
    expect(persistFlags).toHaveLength(CI_JOBS.length);
    expect(persistFlags.every(Boolean)).toBe(true);

    const persistLines = raw
      .split('\n')
      .filter((line) => /^\s+persist-credentials:\s*false\s*$/.test(line));
    expect(persistLines).toHaveLength(CI_JOBS.length);
    expect(raw).not.toMatch(/persist-credentials:\s*true/);
  });

  it('deploy.yml pins contents: read (+ allowlisted deployments: write) and persist-credentials: false', () => {
    const { raw, doc } = loadWorkflow('deploy.yml');

    expect(doc.permissions?.contents).toBe('read');
    expect(doc.permissions?.deployments).toBe('write');
    expect(Object.keys(doc.permissions ?? {}).sort()).toEqual([
      'contents',
      'deployments',
    ]);

    const persistFlags = checkoutPersistFlags(doc);
    expect(persistFlags).toEqual([true]);
    expect(raw).not.toMatch(/persist-credentials:\s*true/);
  });

  it('check-workflows audit passes on live workflows', () => {
    const { files, violations } = auditWorkflowsDir();
    expect(files).toEqual(['ci.yml', 'deploy.yml']);
    expect(violations).toEqual([]);
  });

  it('audit doc exists with task id and line citations', () => {
    const docPath = resolve(
      process.cwd(),
      'docs/dev/ci-permissions-persist-credentials-pin-audit-q-mp-279.md'
    );
    const text = readFileSync(docPath, 'utf8');
    expect(text).toContain('q-mp-279');
    expect(text).toMatch(/contents:\s*read/);
    expect(text).toMatch(/persist-credentials:\s*false/);
    expect(text).toMatch(/ci\.yml:16/);
    expect(text).toMatch(/12/);
  });
});
