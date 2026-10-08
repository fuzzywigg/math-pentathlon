#!/usr/bin/env node
/**
 * Workflow hardening contract for .github/workflows/*.yml
 *
 * Enforces least-privilege permissions, persist-credentials: false,
 * concurrency cancel-in-progress, job timeouts, lockfile-keyed npm cache,
 * Playwright browser cache (when Playwright is installed), consistent
 * action pinning (full SHA), and no secrets on pull_request workflows.
 *
 * Usage: npm run check:workflows
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const WORKFLOWS_DIR = path.join(ROOT, '.github', 'workflows');

/** @typedef {{ file: string, message: string }} Violation */

const SHA_PIN = /^[0-9a-f]{40}$/i;
const MAJOR_PIN = /^v\d+$/;

/** Workflows allowed extra write scopes beyond contents: read. */
const EXTRA_WRITE_ALLOWLIST = {
  'deploy.yml': new Set(['deployments']),
};

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * @param {unknown} on
 * @returns {boolean}
 */
export function hasPullRequestTrigger(on) {
  if (!isObject(on)) return false;
  return 'pull_request' in on || 'pull_request_target' in on;
}

/**
 * @param {string} uses
 * @returns {{ action: string, ref: string } | null}
 */
export function parseUses(uses) {
  if (typeof uses !== 'string' || !uses.includes('@')) return null;
  const at = uses.lastIndexOf('@');
  return { action: uses.slice(0, at), ref: uses.slice(at + 1) };
}

/**
 * @param {unknown} steps
 * @returns {Record<string, unknown>[]}
 */
function asSteps(steps) {
  if (!Array.isArray(steps)) return [];
  return steps.filter(isObject);
}

/**
 * @param {string} file
 * @param {unknown} doc
 * @param {string} raw
 * @returns {Violation[]}
 */
export function auditWorkflow(file, doc, raw) {
  /** @type {Violation[]} */
  const violations = [];
  const fail = (message) => violations.push({ file, message });

  if (!isObject(doc)) {
    fail('workflow YAML did not parse to an object');
    return violations;
  }

  // --- permissions ---
  if (!isObject(doc.permissions)) {
    fail('missing top-level permissions: (default contents: read required)');
  } else {
    const perms = /** @type {Record<string, unknown>} */ (doc.permissions);
    if (perms.contents !== 'read') {
      fail(
        `permissions.contents must be "read" (got ${JSON.stringify(perms.contents)})`
      );
    }
    const allowedExtra = EXTRA_WRITE_ALLOWLIST[file] ?? new Set();
    for (const [scope, level] of Object.entries(perms)) {
      if (scope === 'contents') continue;
      if (level === 'write' && !allowedExtra.has(scope)) {
        fail(
          `permissions.${scope}: write not allowlisted for ${file} (least privilege)`
        );
      }
    }
  }

  // --- concurrency ---
  if (!isObject(doc.concurrency)) {
    fail('missing top-level concurrency group');
  } else {
    const conc = /** @type {Record<string, unknown>} */ (doc.concurrency);
    if (typeof conc.group !== 'string' || conc.group.length === 0) {
      fail('concurrency.group must be a non-empty string');
    }
    if (conc['cancel-in-progress'] !== true) {
      fail('concurrency.cancel-in-progress must be true');
    }
  }

  // --- pull_request_target / secrets ---
  const on = doc.on ?? doc.true;
  if (isObject(on) && 'pull_request_target' in on) {
    fail('pull_request_target is forbidden (fork secret exfiltration risk)');
  }
  if (hasPullRequestTrigger(on)) {
    // Raw scan: secrets.* must not appear in PR-triggered workflows.
    // GITHUB_TOKEN is automatic and not needed via secrets.GITHUB_TOKEN here.
    if (/\$\{\{\s*secrets\./.test(raw)) {
      fail(
        'secrets.* must not appear in workflows triggered by pull_request (fork runs)'
      );
    }
  }

  // --- jobs ---
  if (!isObject(doc.jobs) || Object.keys(doc.jobs).length === 0) {
    fail('missing jobs:');
    return violations;
  }

  /** @type {string[]} */
  const actionRefs = [];

  for (const [jobId, jobVal] of Object.entries(
    /** @type {Record<string, unknown>} */ (doc.jobs)
  )) {
    if (!isObject(jobVal)) {
      fail(`job ${jobId}: not an object`);
      continue;
    }
    const job = /** @type {Record<string, unknown>} */ (jobVal);

    if (
      typeof job['timeout-minutes'] !== 'number' ||
      job['timeout-minutes'] <= 0
    ) {
      fail(`job ${jobId}: missing positive timeout-minutes`);
    }

    const steps = asSteps(job.steps);
    let hasCheckout = false;
    let checkoutPersistOk = true;
    let hasSetupNode = false;
    let setupNodeCacheOk = true;
    let installsPlaywright = false;
    let hasPlaywrightCache = false;

    for (const step of steps) {
      if (typeof step.uses === 'string') {
        const parsed = parseUses(step.uses);
        if (parsed) {
          actionRefs.push(parsed.ref);
          const pinOk =
            SHA_PIN.test(parsed.ref) || MAJOR_PIN.test(parsed.ref);
          if (!pinOk) {
            fail(
              `job ${jobId}: action ${step.uses} must be pinned to a full SHA or major tag (vN)`
            );
          }
        }

        if (step.uses.startsWith('actions/checkout@')) {
          hasCheckout = true;
          const withObj = isObject(step.with) ? step.with : {};
          if (withObj['persist-credentials'] !== false) {
            checkoutPersistOk = false;
          }
        }

        if (step.uses.startsWith('actions/setup-node@')) {
          hasSetupNode = true;
          const withObj = isObject(step.with) ? step.with : {};
          if (withObj.cache !== 'npm') {
            setupNodeCacheOk = false;
          }
          const depPath = withObj['cache-dependency-path'];
          const depOk =
            depPath === 'package-lock.json' ||
            (typeof depPath === 'string' &&
              depPath.split(/\n/).some((l) => l.trim() === 'package-lock.json'));
          if (!depOk) {
            setupNodeCacheOk = false;
          }
        }

        if (step.uses.startsWith('actions/cache@')) {
          const withObj = isObject(step.with) ? step.with : {};
          const cachePath = String(withObj.path ?? '');
          const key = String(withObj.key ?? '');
          if (
            cachePath.includes('ms-playwright') &&
            key.includes("hashFiles('package-lock.json')")
          ) {
            hasPlaywrightCache = true;
          }
        }
      }

      if (typeof step.run === 'string' && /playwright\s+install\b/.test(step.run)) {
        installsPlaywright = true;
      }

      // Hard rule: no apt installs in CI.
      if (
        typeof step.run === 'string' &&
        /\bapt(-get)?\s+install\b/.test(step.run)
      ) {
        fail(`job ${jobId}: apt installs are forbidden in CI`);
      }
    }

    if (hasCheckout && !checkoutPersistOk) {
      fail(
        `job ${jobId}: actions/checkout must set persist-credentials: false`
      );
    }
    if (hasSetupNode && !setupNodeCacheOk) {
      fail(
        `job ${jobId}: actions/setup-node must set cache: npm and cache-dependency-path: package-lock.json`
      );
    }
    if (installsPlaywright && !hasPlaywrightCache) {
      fail(
        `job ${jobId}: Playwright install requires actions/cache on ~/.cache/ms-playwright keyed with hashFiles('package-lock.json')`
      );
    }
  }

  // Consistent pin style: if any SHA pin is used, all must be SHA (no floating majors mixed in).
  const shaCount = actionRefs.filter((r) => SHA_PIN.test(r)).length;
  const majorCount = actionRefs.filter((r) => MAJOR_PIN.test(r)).length;
  if (shaCount > 0 && majorCount > 0) {
    fail(
      'action pins must be consistent: mix of full SHA and major tags is not allowed'
    );
  }

  return violations;
}

/**
 * @param {string} [dir]
 * @returns {{ files: string[], violations: Violation[] }}
 */
export function auditWorkflowsDir(dir = WORKFLOWS_DIR) {
  if (!fs.existsSync(dir)) {
    return {
      files: [],
      violations: [{ file: path.relative(ROOT, dir), message: 'directory missing' }],
    };
  }

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'))
    .sort();

  /** @type {Violation[]} */
  const violations = [];

  if (files.length === 0) {
    violations.push({ file: path.relative(ROOT, dir), message: 'no workflow files' });
  }

  for (const file of files) {
    const abs = path.join(dir, file);
    const raw = fs.readFileSync(abs, 'utf8');
    let doc;
    try {
      doc = yaml.load(raw);
    } catch (err) {
      violations.push({
        file,
        message: `YAML parse error: ${err instanceof Error ? err.message : String(err)}`,
      });
      continue;
    }
    violations.push(...auditWorkflow(file, doc, raw));
  }

  return { files, violations };
}

function main() {
  const { files, violations } = auditWorkflowsDir();
  if (violations.length === 0) {
    console.log(
      `check:workflows OK — ${files.length} file(s): ${files.join(', ')}`
    );
    process.exit(0);
  }
  console.error('check:workflows FAILED:');
  for (const v of violations) {
    console.error(`  - ${v.file}: ${v.message}`);
  }
  process.exit(1);
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  main();
}
