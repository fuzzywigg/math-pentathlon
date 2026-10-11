/**
 * Workflow hardening contract — parses .github/workflows YAML and rejects
 * regressions (permissions, checkout creds, concurrency, timeouts, caches,
 * action pins, secrets on pull_request).
 *
 * Task: burn-1008-mp-ci-workflow-hardening
 */
import { describe, it, expect } from 'vitest';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import yaml from 'js-yaml';
import {
  auditWorkflow,
  auditWorkflowsDir,
  hasPullRequestTrigger,
  isYamlFalse,
  isYamlTrue,
  onIncludesEvent,
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

  it('hasPullRequestTrigger honors list-form on: [pull_request] (q-mp-1077)', () => {
    expect(hasPullRequestTrigger(['pull_request'])).toBe(true);
    expect(hasPullRequestTrigger(['push', 'pull_request'])).toBe(true);
    expect(hasPullRequestTrigger(['pull_request_target'])).toBe(true);
    expect(hasPullRequestTrigger(['push', 'workflow_dispatch'])).toBe(false);
    expect(
      onIncludesEvent(['pull_request_target'], 'pull_request_target')
    ).toBe(true);
    expect(onIncludesEvent(['pull_request'], 'pull_request_target')).toBe(
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
    expect(messages.some((m) => m.includes('persist-credentials: false'))).toBe(
      true
    );
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

  it('accepts numeric-string timeout-minutes (q-mp-1057)', () => {
    const quoted = GOOD_CI.replace(
      'timeout-minutes: 10',
      'timeout-minutes: "20"'
    );
    expect(auditWorkflow('ci.yml', yaml.load(quoted), quoted)).toEqual([]);

    const zero = GOOD_CI.replace('timeout-minutes: 10', 'timeout-minutes: "0"');
    expect(
      auditWorkflow('ci.yml', yaml.load(zero), zero).some((v) =>
        v.message.includes('timeout-minutes')
      )
    ).toBe(true);

    const nonNumeric = GOOD_CI.replace(
      'timeout-minutes: 10',
      'timeout-minutes: "abc"'
    );
    expect(
      auditWorkflow('ci.yml', yaml.load(nonNumeric), nonNumeric).some((v) =>
        v.message.includes('timeout-minutes')
      )
    ).toBe(true);
  });

  it('accepts quoted YAML bools for cancel / persist-credentials (q-mp-1078)', () => {
    expect(isYamlTrue(true)).toBe(true);
    expect(isYamlTrue('true')).toBe(true);
    // Bare True/False are booleans under js-yaml CORE; quoted "True" stays a string.
    expect(isYamlTrue('True')).toBe(false);
    expect(isYamlFalse(false)).toBe(true);
    expect(isYamlFalse('false')).toBe(true);
    expect(isYamlFalse('False')).toBe(false);

    const quoted = GOOD_CI.replace(
      'cancel-in-progress: true',
      'cancel-in-progress: "true"'
    ).replace('persist-credentials: false', 'persist-credentials: "false"');
    expect(auditWorkflow('ci.yml', yaml.load(quoted), quoted)).toEqual([]);

    const junkCancel = GOOD_CI.replace(
      'cancel-in-progress: true',
      'cancel-in-progress: "maybe"'
    );
    expect(
      auditWorkflow('ci.yml', yaml.load(junkCancel), junkCancel).some((v) =>
        v.message.includes('cancel-in-progress must be true')
      )
    ).toBe(true);

    const junkPersist = GOOD_CI.replace(
      'persist-credentials: false',
      'persist-credentials: "maybe"'
    );
    expect(
      auditWorkflow('ci.yml', yaml.load(junkPersist), junkPersist).some((v) =>
        v.message.includes('persist-credentials: false')
      )
    ).toBe(true);
  });

  it('accepts YAML 1.1 yes/on/no/off for cancel / persist-credentials (q-mp-1097)', () => {
    expect(isYamlTrue('yes')).toBe(true);
    expect(isYamlTrue('Yes')).toBe(true);
    expect(isYamlTrue('YES')).toBe(true);
    expect(isYamlTrue('on')).toBe(true);
    expect(isYamlTrue('ON')).toBe(true);
    expect(isYamlTrue('maybe')).toBe(false);
    expect(isYamlTrue(1)).toBe(false);

    expect(isYamlFalse('no')).toBe(true);
    expect(isYamlFalse('No')).toBe(true);
    expect(isYamlFalse('off')).toBe(true);
    expect(isYamlFalse('OFF')).toBe(true);
    expect(isYamlFalse('maybe')).toBe(false);
    expect(isYamlFalse(0)).toBe(false);

    for (const cancel of ['yes', 'on', 'Yes', 'ON', '"yes"']) {
      const raw = GOOD_CI.replace(
        'cancel-in-progress: true',
        `cancel-in-progress: ${cancel}`
      );
      expect(auditWorkflow('ci.yml', yaml.load(raw), raw)).toEqual([]);
    }

    for (const persist of ['no', 'off', 'No', 'OFF', '"no"']) {
      const raw = GOOD_CI.replace(
        'persist-credentials: false',
        `persist-credentials: ${persist}`
      );
      expect(auditWorkflow('ci.yml', yaml.load(raw), raw)).toEqual([]);
    }

    // Truthy persist / falsy cancel still fail the pin.
    const badPersistYes = GOOD_CI.replace(
      'persist-credentials: false',
      'persist-credentials: yes'
    );
    expect(
      auditWorkflow('ci.yml', yaml.load(badPersistYes), badPersistYes).some(
        (v) => v.message.includes('persist-credentials: false')
      )
    ).toBe(true);

    const badCancelNo = GOOD_CI.replace(
      'cancel-in-progress: true',
      'cancel-in-progress: no'
    );
    expect(
      auditWorkflow('ci.yml', yaml.load(badCancelNo), badCancelNo).some((v) =>
        v.message.includes('cancel-in-progress must be true')
      )
    ).toBe(true);
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

  it('rejects secrets on list-form on: [pull_request] (q-mp-1077)', () => {
    const listForm = GOOD_CI.replace(
      'on:\n  pull_request:\n    branches: [alpha]',
      'on: [pull_request]'
    );
    const withSecret = `${listForm}      - name: leak
        env:
          TOKEN: \${{ secrets.NPM_TOKEN }}
        run: echo hi
`;
    expect(auditWorkflow('ci.yml', yaml.load(listForm), listForm)).toEqual([]);
    const messages = auditWorkflow(
      'ci.yml',
      yaml.load(withSecret),
      withSecret
    ).map((v) => v.message);
    expect(messages.some((m) => m.includes('secrets.*'))).toBe(true);
  });

  it('forbids list-form on: [pull_request_target] (q-mp-1077)', () => {
    const listTarget = GOOD_CI.replace(
      'on:\n  pull_request:\n    branches: [alpha]',
      'on: [pull_request_target]'
    );
    const messages = auditWorkflow(
      'ci.yml',
      yaml.load(listTarget),
      listTarget
    ).map((v) => v.message);
    expect(
      messages.some((m) => m.includes('pull_request_target is forbidden'))
    ).toBe(true);
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

  it('lint job keeps soft check:copy-pins after verify (q-mp-1029)', () => {
    const ci = readFileSync(
      join(process.cwd(), '.github/workflows/ci.yml'),
      'utf8'
    );
    expect(ci).toContain('npm run verify');
    // Soft report-only step: --fail + continue-on-error; outside package.json verify.
    expect(ci).toMatch(
      /npm run verify[\s\S]*?continue-on-error:\s*true[\s\S]*?check:copy-pins -- --fail/
    );
  });

  it('build job keeps soft size:check --fail-on-new-over (q-mp-1041)', () => {
    const ci = readFileSync(
      join(process.cwd(), '.github/workflows/ci.yml'),
      'utf8'
    );
    // Soft gzip ratchet: novel OVER exits 1; continue-on-error keeps build green.
    expect(ci).toMatch(
      /continue-on-error:\s*true[\s\S]*?size:check -- --fail-on-new-over/
    );
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
