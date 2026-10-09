/**
 * Workflow hardening contract — parses .github/workflows YAML and rejects
 * regressions (permissions, checkout creds, concurrency, timeouts, caches,
 * action pins, secrets on pull_request).
 *
 * Task: burn-1008-mp-ci-workflow-hardening
 */
import { describe, it, expect } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import yaml from 'js-yaml';
import {
  auditWorkflow,
  auditWorkflowsDir,
  hasPullRequestTrigger,
  parseUses,
} from '../../scripts/check-workflows.mjs';

const GOOD_CI = `
name: CI
on:
  pull_request:
    branches: [alpha]
permissions:
  contents: read
concurrency:
  group: ci-\${{ github.ref }}
  cancel-in-progress: true
jobs:
  lint:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        with:
          persist-credentials: false
      - uses: actions/setup-node@bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
        with:
          node-version: '20'
          cache: npm
          cache-dependency-path: package-lock.json
      - run: npm ci
`;

describe('workflow contract helpers', () => {
  it('parseUses splits action and ref', () => {
    expect(parseUses('actions/checkout@abc')).toEqual({
      action: 'actions/checkout',
      ref: 'abc',
    });
    expect(parseUses('not-an-action')).toBeNull();
  });

  it('hasPullRequestTrigger detects PR events', () => {
    expect(hasPullRequestTrigger({ pull_request: null })).toBe(true);
    expect(hasPullRequestTrigger({ pull_request_target: {} })).toBe(true);
    expect(hasPullRequestTrigger({ push: { branches: ['alpha'] } })).toBe(
      false
    );
  });
});

describe('auditWorkflow invariants', () => {
  it('accepts a hardened CI workflow', () => {
    const doc = yaml.load(GOOD_CI);
    expect(auditWorkflow('ci.yml', doc, GOOD_CI)).toEqual([]);
  });

  it('requires contents: read and persist-credentials: false', () => {
    const bad = GOOD_CI.replace('contents: read', 'contents: write').replace(
      'persist-credentials: false',
      'persist-credentials: true'
    );
    const messages = auditWorkflow('ci.yml', yaml.load(bad), bad).map(
      (v) => v.message
    );
    expect(messages.some((m) => m.includes('contents must be "read"'))).toBe(
      true
    );
    expect(
      messages.some((m) => m.includes('persist-credentials: false'))
    ).toBe(true);
  });

  it('requires concurrency cancel-in-progress and job timeouts', () => {
    const bad = `
name: CI
on:
  push:
    branches: [alpha]
permissions:
  contents: read
concurrency:
  group: ci
  cancel-in-progress: false
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        with:
          persist-credentials: false
      - uses: actions/setup-node@bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
        with:
          node-version: '20'
          cache: npm
          cache-dependency-path: package-lock.json
`;
    const messages = auditWorkflow('ci.yml', yaml.load(bad), bad).map(
      (v) => v.message
    );
    expect(
      messages.some((m) => m.includes('cancel-in-progress must be true'))
    ).toBe(true);
    expect(messages.some((m) => m.includes('timeout-minutes'))).toBe(true);
  });

  it('rejects secrets on pull_request workflows', () => {
    const bad = `${GOOD_CI}      - name: leak
        env:
          TOKEN: \${{ secrets.CLOUDFLARE_API_TOKEN }}
        run: echo hi
`;
    const messages = auditWorkflow('ci.yml', yaml.load(bad), bad).map(
      (v) => v.message
    );
    expect(messages.some((m) => m.includes('secrets.*'))).toBe(true);
  });

  it('requires Playwright cache keyed on package-lock.json', () => {
    const withPw = `
name: CI
on:
  push:
    branches: [alpha]
permissions:
  contents: read
concurrency:
  group: ci
  cancel-in-progress: true
jobs:
  e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        with:
          persist-credentials: false
      - uses: actions/setup-node@bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
        with:
          node-version: '20'
          cache: npm
          cache-dependency-path: package-lock.json
      - run: npx playwright install --with-deps chromium
`;
    const messages = auditWorkflow('ci.yml', yaml.load(withPw), withPw).map(
      (v) => v.message
    );
    expect(messages.some((m) => m.includes('Playwright install'))).toBe(true);
  });

  it('rejects mixed SHA and major action pins', () => {
    const mixed = GOOD_CI.replace(
      'actions/setup-node@bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      'actions/setup-node@v7'
    );
    const messages = auditWorkflow('ci.yml', yaml.load(mixed), mixed).map(
      (v) => v.message
    );
    expect(messages.some((m) => m.includes('consistent'))).toBe(true);
  });

  it('allows deployments: write only on deploy.yml', () => {
    const deployish = GOOD_CI.replace(
      'permissions:\n  contents: read',
      'permissions:\n  contents: read\n  deployments: write'
    ).replace(
      'pull_request:\n    branches: [alpha]',
      'push:\n    branches: [alpha]'
    );
    expect(
      auditWorkflow('ci.yml', yaml.load(deployish), deployish).some((v) =>
        v.message.includes('deployments')
      )
    ).toBe(true);
    expect(
      auditWorkflow('deploy.yml', yaml.load(deployish), deployish)
    ).toEqual([]);
  });
});

describe('live .github/workflows contract', () => {
  it('auditWorkflowsDir passes on the repo workflows', () => {
    const { files, violations } = auditWorkflowsDir();
    expect(files.length).toBeGreaterThanOrEqual(2);
    expect(files).toContain('ci.yml');
    expect(files).toContain('deploy.yml');
    expect(violations).toEqual([]);
  });

  it('npm run check:workflows exits 0', () => {
    const out = execFileSync('npm', ['run', 'check:workflows'], {
      encoding: 'utf8',
      cwd: process.cwd(),
    });
    expect(out).toMatch(/check:workflows OK/);
  });

  it('fails a temp workflow that drops persist-credentials', () => {
    const dir = mkdtempSync(join(tmpdir(), 'wf-contract-'));
    try {
      writeFileSync(
        join(dir, 'broken.yml'),
        GOOD_CI.replace(
          /persist-credentials:\s*false/,
          'persist-credentials: true'
        ),
        'utf8'
      );
      const { violations } = auditWorkflowsDir(dir);
      expect(
        violations.some((v) => v.message.includes('persist-credentials'))
      ).toBe(true);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
