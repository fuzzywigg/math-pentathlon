#!/usr/bin/env node
/**
 * Dependency license + provenance report (CycloneDX-style SBOM).
 *
 * Reads package-lock.json only (no new runtime deps). Optionally enriches
 * missing license fields from installed node_modules package.json files.
 *
 * Reports:
 *   - CycloneDX 1.5 JSON SBOM (npm lockfile components)
 *   - License counts (production vs CI/dev)
 *   - Copyleft / unknown / missing license flags
 *   - Packages with install scripts (hasInstallScript)
 *   - Bundled third-party / first-party assets (fonts, icons, images, sounds)
 *
 * Exit codes:
 *   0 — report completed; no explicitly denied license in the tree
 *   1 — denied license present, lockfile missing, malformed/unreadable, or
 *       packages null/missing/empty
 *
 * Report-only for copyleft/unknown/install-script flags (still exit 0).
 *
 * Usage:
 *   npm run report:licenses
 *   node scripts/report-licenses.mjs [--dry-run] [--help]
 *
 * Unknown flags exit 2. --help/-h exit 0 without scanning or writing reports.
 * --dry-run scans and prints the summary but does not write under
 * test-results/licenses (q-mp-979).
 * Malformed package-lock.json prints a short message + hint (no stack) and
 * exits 1 (q-mp-1026). Missing lock message unchanged.
 * Null / missing / empty `packages` prints a short error and exits 1 with no
 * artifact writes — including no --dry-run "Would write" (q-mp-1037).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LOCK_PATH = path.join(ROOT, 'package-lock.json');
export const OUT_DIR = path.join(ROOT, 'test-results', 'licenses');
export const OUT_DIR_REL = 'test-results/licenses';

export const USAGE = `Usage: node scripts/report-licenses.mjs [options]

Options:
  --dry-run        Scan and print summary without writing test-results/licenses
  -h, --help       Show this help

Default (no --dry-run) writes test-results/licenses/{sbom.cdx.json,summary.md,summary.json}.
`;

/**
 * Parse CLI argv (slice(2) form). Hermetic — no I/O, no process.exit (q-mp-979).
 *
 * @param {string[]} argv
 * @returns {{
 *   ok: true,
 *   help: boolean,
 *   dryRun: boolean,
 * } | {
 *   ok: false,
 *   message: string,
 * }}
 */
export function parseArgs(argv) {
  let help = false;
  let dryRun = false;
  for (const a of argv) {
    if (a === '--help' || a === '-h') {
      help = true;
    } else if (a === '--dry-run') {
      dryRun = true;
    } else if (a.startsWith('-')) {
      return { ok: false, message: `Unknown flag: ${a}` };
    } else {
      return { ok: false, message: `Unexpected argument: ${a}` };
    }
  }
  return { ok: true, help, dryRun };
}

/**
 * Write license report artifacts unless dry-run. Hermetic aside from fs writes.
 *
 * @param {{
 *   sbomText: string,
 *   summaryMd: string,
 *   summaryJsonText: string,
 *   dryRun?: boolean,
 * }} opts
 * @returns {{
 *   wrote: boolean,
 *   outDir: string,
 *   paths: { sbom: string, summaryMd: string, summaryJson: string },
 * }}
 */
export function writeLicenseArtifacts(opts) {
  const dryRun = opts.dryRun === true;
  const paths = {
    sbom: path.join(OUT_DIR, 'sbom.cdx.json'),
    summaryMd: path.join(OUT_DIR, 'summary.md'),
    summaryJson: path.join(OUT_DIR, 'summary.json'),
  };
  if (!dryRun) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(paths.sbom, opts.sbomText);
    fs.writeFileSync(paths.summaryMd, opts.summaryMd);
    fs.writeFileSync(paths.summaryJson, opts.summaryJsonText);
  }
  return { wrote: !dryRun, outDir: OUT_DIR, paths };
}

/**
 * Stable message for malformed package-lock.json (q-mp-1026) — no stack.
 * @param {string} [lockPath]
 * @param {string} [detail]
 * @returns {string}
 */
export function malformedLockMessage(
  lockPath = LOCK_PATH,
  detail = 'Unexpected end of JSON input'
) {
  const display = String(lockPath).replace(/\\/g, '/');
  return [
    `report:licenses — malformed JSON in ${display}`,
    detail,
    'Fix or regenerate package-lock.json (run `npm install`).',
  ].join('\n');
}

/**
 * True when lock.packages is a non-empty plain object (q-mp-1037).
 * Null, undefined, arrays, and `{}` are not usable.
 * @param {unknown} packages
 * @returns {boolean}
 */
export function isUsableLockPackages(packages) {
  return (
    packages != null &&
    typeof packages === 'object' &&
    !Array.isArray(packages) &&
    Object.keys(/** @type {object} */ (packages)).length > 0
  );
}

/**
 * Stable message for null / missing / empty lock packages (q-mp-1037).
 * @param {string} [lockPath]
 * @returns {string}
 */
export function emptyPackagesMessage(lockPath = LOCK_PATH) {
  const display = String(lockPath).replace(/\\/g, '/');
  return [
    `report:licenses — empty or missing packages in ${display}`,
    'package-lock.json must include a non-empty "packages" object.',
    'Fix or regenerate package-lock.json (run `npm install`).',
  ].join('\n');
}

/** Strong copyleft / source-available terms that fail the report if present. */
const DENIED_LICENSE_PATTERNS = [
  // `\bAGPL` covers SPDX (AGPL-3.0) and legacy AGPLv3 (q-mp-1079).
  /\bAGPL/i,
  /\bGPL-2\.0\b/i,
  /\bGPL-3\.0\b/i,
  // Legacy npm spellings (q-mp-1054).
  /\bGPLv2\b/i,
  /\bGPLv3\b/i,
  /\bGNU\s+GPL\b/i,
  /\bGPL\b/i,
  // Long-form GPL prose beyond short tokens (q-mp-1079).
  /\bGNU\s+General\s+Public\s+License\b/i,
  /\bSSPL\b/i,
  /\bBUSL\b/i,
  // SSPL / BUSL prose forms (q-mp-1079); source-available families left to 1081.
  /\bServer\s+Side\s+Public\s+License\b/i,
  /\bBusiness\s+Source\s+License\b/i,
  /\bCommons\s*Clause\b/i,
  /\bCPAL\b/i,
];

/**
 * Weak / file-level copyleft and unusual SPDX ids — flag for owner review,
 * do not fail the report.
 */
const COPYLEFT_OR_REVIEW_PATTERNS = [
  // `\bMPL` covers MPL-2.0; `\bMPLv` covers legacy MPLv2 (q-mp-1079).
  /\bMPL(?:-|\b|v)/i,
  /\bMozilla\s+Public\s+License\b/i,
  // `\bLGPL` covers SPDX LGPL-2.1 and legacy LGPLv2.1 / LGPLv3 (q-mp-1079).
  /\bLGPL/i,
  /\bEPL\b/i,
  // Eclipse Public License prose (q-mp-1104); SPDX EPL-* already via `\bEPL\b`.
  /\bEclipse\s+Public\s+License\b/i,
  // CPL SPDX + Common Public License prose (q-mp-1103). Distinct from denied CPAL.
  /\bCPL(?:-|\b)/i,
  /\bCommon\s+Public\s+License\b/i,
  /\bCDDL\b/i,
  /\bEUPL\b/i,
  /\bOSL\b/i,
  /\bPython-2\.0\b/i,
];

/**
 * Unknown / proprietary tokens (full-string on the whole expression or on
 * each OR/AND alternative — see `hasUnknownLicenseToken`, q-mp-1080).
 * Source-available / proprietary prose policy is HOLD-CHECK q-mp-1081.
 * Bare / URL `Custom*` npm license strings → unknown (q-mp-1102); not
 * `Commercial` (1081 leave-ok).
 */
const UNKNOWN_LICENSE_PATTERNS = [
  /^$/i,
  /^UNKNOWN$/i,
  /^UNLICENSED$/i,
  /^SEE\s+LICENSE/i,
  /^PROPRIETARY$/i,
  /^NONE$/i,
  // npm "Custom" / "Custom: https://…" (q-mp-1102).
  /^CUSTOM(?:\s*:.*)?$/i,
];

/** Bundled static assets under public/ that ship with the built app. */
export const BUNDLED_ASSET_CATALOG = [
  {
    path: 'public/fonts/inter-latin-400-normal.woff2',
    kind: 'font',
    name: 'Inter (latin 400)',
    license: 'OFL-1.1',
    licenseSource:
      'SIL Open Font License 1.1 — https://github.com/rsms/inter (Inter by Rasmus Andersson). Self-hosted latin subset; naming matches fontsource-style woff2 files.',
    thirdParty: true,
  },
  {
    path: 'public/fonts/inter-latin-500-normal.woff2',
    kind: 'font',
    name: 'Inter (latin 500)',
    license: 'OFL-1.1',
    licenseSource:
      'SIL Open Font License 1.1 — https://github.com/rsms/inter (Inter by Rasmus Andersson). Self-hosted latin subset; naming matches fontsource-style woff2 files.',
    thirdParty: true,
  },
  {
    path: 'public/fonts/inter-latin-600-normal.woff2',
    kind: 'font',
    name: 'Inter (latin 600)',
    license: 'OFL-1.1',
    licenseSource:
      'SIL Open Font License 1.1 — https://github.com/rsms/inter (Inter by Rasmus Andersson). Self-hosted latin subset; naming matches fontsource-style woff2 files.',
    thirdParty: true,
  },
  {
    path: 'public/fonts/inter-latin-700-normal.woff2',
    kind: 'font',
    name: 'Inter (latin 700)',
    license: 'OFL-1.1',
    licenseSource:
      'SIL Open Font License 1.1 — https://github.com/rsms/inter (Inter by Rasmus Andersson). Self-hosted latin subset; naming matches fontsource-style woff2 files.',
    thirdParty: true,
  },
  {
    path: 'public/favicon.svg',
    kind: 'image',
    name: 'Math Pentathlon favicon (SVG)',
    license: 'Project / first-party',
    licenseSource:
      'Original Math Pentathlon artwork in-repo (public/favicon.svg). Not a third-party asset.',
    thirdParty: false,
  },
  {
    path: 'public/favicon.ico',
    kind: 'image',
    name: 'Math Pentathlon favicon (ICO)',
    license: 'Project / first-party',
    licenseSource:
      'Original Math Pentathlon artwork in-repo (public/favicon.ico). Not a third-party asset.',
    thirdParty: false,
  },
  {
    path: 'public/icons/icon-180.png',
    kind: 'icon',
    name: 'PWA apple-touch icon 180',
    license: 'Project / first-party',
    licenseSource:
      'Original Math Pentathlon PWA icon set under public/icons/. Not a third-party asset.',
    thirdParty: false,
  },
  {
    path: 'public/icons/icon-192.png',
    kind: 'icon',
    name: 'PWA icon 192',
    license: 'Project / first-party',
    licenseSource:
      'Original Math Pentathlon PWA icon set under public/icons/. Not a third-party asset.',
    thirdParty: false,
  },
  {
    path: 'public/icons/icon-512.png',
    kind: 'icon',
    name: 'PWA icon 512',
    license: 'Project / first-party',
    licenseSource:
      'Original Math Pentathlon PWA icon set under public/icons/. Not a third-party asset.',
    thirdParty: false,
  },
  {
    path: 'public/icons/icon-512-maskable.png',
    kind: 'icon',
    name: 'PWA maskable icon 512',
    license: 'Project / first-party',
    licenseSource:
      'Original Math Pentathlon PWA icon set under public/icons/. Not a third-party asset.',
    thirdParty: false,
  },
];

/**
 * @param {unknown} license
 * @returns {string}
 */
export function normalizeLicense(license) {
  if (license == null) return '';
  if (typeof license === 'string') return license.trim();
  if (typeof license === 'object') {
    if (Array.isArray(license)) {
      return license.map((item) => normalizeLicense(item)).join(' OR ');
    }
    if ('type' in license && typeof license.type === 'string') {
      return license.type.trim();
    }
    return JSON.stringify(license);
  }
  return String(license);
}

/**
 * @param {string} expression
 * @param {RegExp[]} patterns
 */
function matchesAny(expression, patterns) {
  return patterns.some((re) => re.test(expression));
}

/**
 * True when an SPDX-style OR/AND expression includes an unknown/proprietary
 * alternative (q-mp-1080). Bare `LicenseRef-Proprietary` is left to q-mp-1081.
 * @param {string} expression
 * @returns {boolean}
 */
function hasUnknownLicenseToken(expression) {
  if (!/\b(?:OR|AND)\b/i.test(expression)) return false;
  const tokens = expression
    .split(/\b(?:OR|AND)\b/i)
    .map((part) => part.replace(/[()]/g, '').trim())
    .filter(Boolean);
  return tokens.some((token) => matchesAny(token, UNKNOWN_LICENSE_PATTERNS));
}

/**
 * @param {string} expression
 * @returns {'denied'|'copyleft_or_review'|'unknown'|'ok'}
 */
export function classifyLicense(expression) {
  const lic = normalizeLicense(expression);
  if (matchesAny(lic, DENIED_LICENSE_PATTERNS)) return 'denied';
  if (!lic || matchesAny(lic, UNKNOWN_LICENSE_PATTERNS)) return 'unknown';
  // Dual licenses with UNLICENSED / PROPRIETARY / NONE / UNKNOWN must not be ok.
  if (hasUnknownLicenseToken(lic)) return 'unknown';
  if (matchesAny(lic, COPYLEFT_OR_REVIEW_PATTERNS)) return 'copyleft_or_review';
  return 'ok';
}

/**
 * @param {string} lockPath
 * @returns {string}
 */
export function npmPackageNameFromLockPath(lockPath) {
  if (!lockPath || lockPath === '') return '';
  const marker = 'node_modules/';
  const idx = lockPath.lastIndexOf(marker);
  if (idx === -1) return lockPath;
  return lockPath.slice(idx + marker.length);
}

/**
 * @param {object} lock
 * @param {string} [nodeModulesRoot]
 * @returns {Array<{
 *   lockPath: string,
 *   name: string,
 *   version: string,
 *   license: string,
 *   licenseSource: 'lockfile'|'node_modules'|'missing',
 *   production: boolean,
 *   optional: boolean,
 *   hasInstallScript: boolean,
 *   resolved: string,
 *   integrity: string,
 *   classification: ReturnType<typeof classifyLicense>
 * }>}
 */
export function collectPackagesFromLock(lock, nodeModulesRoot = '') {
  // Main rejects null/missing/empty packages (q-mp-1037) before calling this.
  // Keep `|| {}` only as a defensive fallback for hermetic helper callers.
  const packages = isUsableLockPackages(lock.packages) ? lock.packages : {};
  /** @type {ReturnType<typeof collectPackagesFromLock>} */
  const out = [];

  for (const [lockPath, meta] of Object.entries(packages)) {
    if (!lockPath) continue; // root package
    if (!meta || typeof meta !== 'object') continue;

    const name =
      typeof meta.name === 'string' && meta.name
        ? meta.name
        : npmPackageNameFromLockPath(lockPath);
    const version = typeof meta.version === 'string' ? meta.version : '';

    let license = normalizeLicense(meta.license);
    let licenseSource = license ? 'lockfile' : 'missing';

    if (!license && nodeModulesRoot) {
      const pkgJsonPath = path.join(nodeModulesRoot, lockPath, 'package.json');
      try {
        if (fs.existsSync(pkgJsonPath)) {
          const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
          license = normalizeLicense(pkg.license);
          if (license) licenseSource = 'node_modules';
        }
      } catch {
        // ignore unreadable package.json
      }
    }

    out.push({
      lockPath,
      name,
      version,
      license,
      licenseSource,
      production: !meta.dev,
      optional: !!meta.optional,
      hasInstallScript: !!meta.hasInstallScript,
      resolved: typeof meta.resolved === 'string' ? meta.resolved : '',
      integrity: typeof meta.integrity === 'string' ? meta.integrity : '',
      classification: classifyLicense(license),
    });
  }

  out.sort((a, b) => a.lockPath.localeCompare(b.lockPath));
  return out;
}

/**
 * @param {ReturnType<typeof collectPackagesFromLock>} packages
 * @returns {Record<string, number>}
 */
export function countByLicense(packages) {
  /** @type {Record<string, number>} */
  const counts = {};
  for (const pkg of packages) {
    const key = pkg.license || '(missing)';
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.fromEntries(
    Object.entries(counts).sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
    )
  );
}

/**
 * @param {string} root
 * @param {typeof BUNDLED_ASSET_CATALOG} catalog
 */
export function inventoryBundledAssets(root, catalog = BUNDLED_ASSET_CATALOG) {
  return catalog.map((entry) => {
    const abs = path.join(root, entry.path);
    const exists = fs.existsSync(abs);
    let bytes = 0;
    let sha256 = '';
    if (exists) {
      const buf = fs.readFileSync(abs);
      bytes = buf.length;
      sha256 = createHash('sha256').update(buf).digest('hex');
    }
    return { ...entry, exists, bytes, sha256 };
  });
}

/**
 * Discover unexpected media under public/ not listed in the catalog.
 * @param {string} root
 * @param {typeof BUNDLED_ASSET_CATALOG} catalog
 */
export function findUncataloguedPublicMedia(
  root,
  catalog = BUNDLED_ASSET_CATALOG
) {
  const publicDir = path.join(root, 'public');
  const known = new Set(catalog.map((c) => c.path));
  /** @type {string[]} */
  const found = [];
  const mediaRe =
    /\.(woff2?|ttf|otf|eot|mp3|wav|ogg|m4a|png|jpe?g|gif|webp|svg|ico|avif)$/i;

  /**
   * @param {string} dir
   */
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(abs);
        continue;
      }
      if (!ent.isFile() || !mediaRe.test(ent.name)) continue;
      const rel = path.relative(root, abs).split(path.sep).join('/');
      if (!known.has(rel)) found.push(rel);
    }
  }

  walk(publicDir);
  return found.sort();
}

/**
 * @param {{
 *   name: string,
 *   version: string,
 *   packages: ReturnType<typeof collectPackagesFromLock>,
 *   assets: ReturnType<typeof inventoryBundledAssets>
 * }} opts
 */
export function buildCycloneDxBom(opts) {
  const serial = `urn:uuid:${createHash('sha256')
    .update(`${opts.name}@${opts.version}:${opts.packages.length}`)
    .digest('hex')
    .slice(0, 32)
    .replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5')}`;

  const components = opts.packages.map((pkg) => {
    // Scoped purls keep a literal slash after the scope: @scope/name -> %40scope/name
    const purlEncoded = pkg.name.startsWith('@')
      ? `%40${pkg.name.slice(1)}`
      : pkg.name;
    /** @type {Record<string, unknown>} */
    const component = {
      type: 'library',
      'bom-ref': `pkg:npm/${purlEncoded}@${pkg.version}`,
      name: pkg.name,
      version: pkg.version || undefined,
      licenses: pkg.license ? [{ expression: pkg.license }] : undefined,
      purl: pkg.version
        ? `pkg:npm/${purlEncoded}@${pkg.version}`
        : `pkg:npm/${purlEncoded}`,
      scope: pkg.production ? 'required' : 'optional',
    };

    if (pkg.integrity && pkg.integrity.includes('-')) {
      const dash = pkg.integrity.indexOf('-');
      const algRaw = pkg.integrity.slice(0, dash);
      const hashB64 = pkg.integrity.slice(dash + 1);
      const algMap = {
        sha1: 'SHA-1',
        sha256: 'SHA-256',
        sha384: 'SHA-384',
        sha512: 'SHA-512',
      };
      const alg = algMap[algRaw.toLowerCase()] || algRaw.toUpperCase();
      try {
        component.hashes = [
          {
            alg,
            content: Buffer.from(hashB64, 'base64').toString('hex'),
          },
        ];
      } catch {
        // skip malformed integrity
      }
    }

    if (pkg.resolved) {
      component.externalReferences = [
        { type: 'distribution', url: pkg.resolved },
      ];
    }

    /** @type {string[]} */
    const properties = [];
    if (pkg.hasInstallScript) {
      properties.push('hasInstallScript');
    }
    if (pkg.optional) properties.push('optional');
    properties.push(pkg.production ? 'npm:production' : 'npm:development');
    properties.push(`licenseSource:${pkg.licenseSource}`);
    properties.push(`classification:${pkg.classification}`);
    component.properties = properties.map((value) => ({
      name: 'math-pentathlon:flag',
      value,
    }));

    return component;
  });

  for (const asset of opts.assets) {
    components.push({
      type: asset.kind === 'font' ? 'file' : 'file',
      'bom-ref': `file:${asset.path}`,
      name: asset.name,
      licenses: [{ expression: asset.license }],
      hashes: asset.sha256
        ? [{ alg: 'SHA-256', content: asset.sha256 }]
        : undefined,
      properties: [
        { name: 'math-pentathlon:path', value: asset.path },
        {
          name: 'math-pentathlon:thirdParty',
          value: String(asset.thirdParty),
        },
        {
          name: 'math-pentathlon:licenseSource',
          value: asset.licenseSource,
        },
        {
          name: 'math-pentathlon:exists',
          value: String(asset.exists),
        },
      ],
    });
  }

  return {
    bomFormat: 'CycloneDX',
    specVersion: '1.5',
    serialNumber: serial,
    version: 1,
    metadata: {
      timestamp: new Date().toISOString(),
      tools: [
        {
          vendor: 'math-pentathlon',
          name: 'report-licenses',
          version: '1.0.0',
        },
      ],
      component: {
        type: 'application',
        name: opts.name,
        version: opts.version,
        licenses: [{ expression: 'ISC' }],
      },
    },
    components,
  };
}

/**
 * @param {{
 *   packages: ReturnType<typeof collectPackagesFromLock>,
 *   assets: ReturnType<typeof inventoryBundledAssets>,
 *   uncatalogued: string[],
 *   licenseCounts: Record<string, number>,
 *   prodLicenseCounts: Record<string, number>,
 *   denied: ReturnType<typeof collectPackagesFromLock>,
 *   copyleftOrReview: ReturnType<typeof collectPackagesFromLock>,
 *   unknown: ReturnType<typeof collectPackagesFromLock>,
 *   installScripts: ReturnType<typeof collectPackagesFromLock>
 * }} report
 */
export function formatSummaryMarkdown(report) {
  const lines = [];
  lines.push('# License & provenance report');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## Package counts');
  lines.push('');
  lines.push(`- Lockfile packages: **${report.packages.length}**`);
  lines.push(
    `- Production (ships / runtime tree): **${report.packages.filter((p) => p.production).length}**`
  );
  lines.push(
    `- Development / CI: **${report.packages.filter((p) => !p.production).length}**`
  );
  lines.push(`- With install scripts: **${report.installScripts.length}**`);
  lines.push('');
  lines.push('## License counts (all lockfile packages)');
  lines.push('');
  lines.push('| License | Count |');
  lines.push('| --- | ---: |');
  for (const [lic, n] of Object.entries(report.licenseCounts)) {
    lines.push(`| \`${lic}\` | ${n} |`);
  }
  lines.push('');
  lines.push('## License counts (production only)');
  lines.push('');
  lines.push('| License | Count |');
  lines.push('| --- | ---: |');
  for (const [lic, n] of Object.entries(report.prodLicenseCounts)) {
    lines.push(`| \`${lic}\` | ${n} |`);
  }
  if (Object.keys(report.prodLicenseCounts).length === 0) {
    lines.push('| _(none)_ | 0 |');
  }
  lines.push('');
  lines.push('## Flags needing owner decision');
  lines.push('');
  lines.push('### Denied (fails report)');
  lines.push('');
  if (report.denied.length === 0) {
    lines.push('_None._');
  } else {
    for (const pkg of report.denied) {
      lines.push(
        `- \`${pkg.name}@${pkg.version}\` — \`${pkg.license || '(missing)'}\` (${pkg.production ? 'production' : 'dev/CI'})`
      );
    }
  }
  lines.push('');
  lines.push('### Copyleft / unusual (report-only)');
  lines.push('');
  if (report.copyleftOrReview.length === 0) {
    lines.push('_None._');
  } else {
    for (const pkg of report.copyleftOrReview) {
      lines.push(
        `- \`${pkg.name}@${pkg.version}\` — \`${pkg.license}\` (${pkg.production ? 'production' : 'dev/CI'})`
      );
    }
  }
  lines.push('');
  lines.push('### Unknown / missing license (report-only)');
  lines.push('');
  if (report.unknown.length === 0) {
    lines.push('_None._');
  } else {
    for (const pkg of report.unknown) {
      lines.push(
        `- \`${pkg.name}@${pkg.version || '?'}\` — \`${pkg.license || '(missing)'}\` (source: ${pkg.licenseSource})`
      );
    }
  }
  lines.push('');
  lines.push('### Packages with install scripts (report-only)');
  lines.push('');
  if (report.installScripts.length === 0) {
    lines.push('_None._');
  } else {
    for (const pkg of report.installScripts) {
      lines.push(
        `- \`${pkg.name}@${pkg.version}\` — \`${pkg.license || '?'}\`${pkg.optional ? ' (optional)' : ''}`
      );
    }
  }
  lines.push('');
  lines.push('## Bundled assets (fonts / icons / images / sounds)');
  lines.push('');
  lines.push(
    '| Path | Kind | License | Third-party | Bytes | License source |'
  );
  lines.push('| --- | --- | --- | --- | ---: | --- |');
  for (const asset of report.assets) {
    lines.push(
      `| \`${asset.path}\` | ${asset.kind} | \`${asset.license}\` | ${asset.thirdParty ? 'yes' : 'no'} | ${asset.exists ? asset.bytes : 'MISSING'} | ${asset.licenseSource} |`
    );
  }
  lines.push('');
  if (report.uncatalogued.length) {
    lines.push('### Uncatalogued public media (needs owner decision)');
    lines.push('');
    for (const rel of report.uncatalogued) {
      lines.push(`- \`${rel}\``);
    }
    lines.push('');
  } else {
    lines.push('_No uncatalogued public media files._');
    lines.push('');
  }
  lines.push('## CI note');
  lines.push('');
  lines.push(
    'This repository CI uses npm only (no pip allowlist in workflows). All CI Node dependencies are the lockfile `dev: true` tree above.'
  );
  lines.push('');
  return lines.join('\n');
}

function main(argv = process.argv.slice(2)) {
  const parsed = parseArgs(argv);
  if (!parsed.ok) {
    console.error(parsed.message);
    console.error(USAGE.trimEnd());
    process.exit(2);
  }
  if (parsed.help) {
    console.log(USAGE.trimEnd());
    process.exit(0);
  }

  if (!fs.existsSync(LOCK_PATH)) {
    console.error(`Missing ${LOCK_PATH}`);
    process.exit(1);
  }

  let lock;
  try {
    lock = JSON.parse(fs.readFileSync(LOCK_PATH, 'utf8'));
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error(malformedLockMessage(LOCK_PATH, detail));
    process.exit(1);
  }
  if (!isUsableLockPackages(lock.packages)) {
    console.error(emptyPackagesMessage(LOCK_PATH));
    process.exit(1);
  }
  const rootMeta = lock.packages?.[''] || {};
  const appName =
    typeof lock.name === 'string'
      ? lock.name
      : typeof rootMeta.name === 'string'
        ? rootMeta.name
        : 'math-pentathlon';
  const appVersion =
    typeof lock.version === 'string'
      ? lock.version
      : typeof rootMeta.version === 'string'
        ? rootMeta.version
        : '0.0.0';

  const nodeModulesRoot = fs.existsSync(path.join(ROOT, 'node_modules'))
    ? ROOT
    : '';
  const packages = collectPackagesFromLock(lock, nodeModulesRoot);
  const assets = inventoryBundledAssets(ROOT);
  const uncatalogued = findUncataloguedPublicMedia(ROOT);

  const denied = packages.filter((p) => p.classification === 'denied');
  const copyleftOrReview = packages.filter(
    (p) => p.classification === 'copyleft_or_review'
  );
  const unknown = packages.filter((p) => p.classification === 'unknown');
  const installScripts = packages.filter((p) => p.hasInstallScript);
  const licenseCounts = countByLicense(packages);
  const prodLicenseCounts = countByLicense(
    packages.filter((p) => p.production)
  );

  const report = {
    packages,
    assets,
    uncatalogued,
    licenseCounts,
    prodLicenseCounts,
    denied,
    copyleftOrReview,
    unknown,
    installScripts,
  };

  const bom = buildCycloneDxBom({
    name: appName,
    version: appVersion,
    packages,
    assets,
  });
  const summary = formatSummaryMarkdown(report);
  const summaryJsonText = `${JSON.stringify(
    {
      packageCount: packages.length,
      productionCount: packages.filter((p) => p.production).length,
      developmentCount: packages.filter((p) => !p.production).length,
      licenseCounts,
      prodLicenseCounts,
      denied: denied.map((p) => ({
        name: p.name,
        version: p.version,
        license: p.license,
      })),
      copyleftOrReview: copyleftOrReview.map((p) => ({
        name: p.name,
        version: p.version,
        license: p.license,
        production: p.production,
      })),
      unknown: unknown.map((p) => ({
        name: p.name,
        version: p.version,
        license: p.license,
      })),
      installScripts: installScripts.map((p) => ({
        name: p.name,
        version: p.version,
        license: p.license,
        optional: p.optional,
      })),
      assets: assets.map((a) => ({
        path: a.path,
        kind: a.kind,
        license: a.license,
        thirdParty: a.thirdParty,
        exists: a.exists,
        bytes: a.bytes,
      })),
      uncatalogued,
    },
    null,
    2
  )}\n`;

  const dryRun = parsed.dryRun === true;
  writeLicenseArtifacts({
    sbomText: `${JSON.stringify(bom, null, 2)}\n`,
    summaryMd: summary,
    summaryJsonText,
    dryRun,
  });

  const verb = dryRun ? 'Would write' : 'Wrote';
  const suffix = dryRun ? ' (dry-run; not writing)' : '';
  const outRel = path.relative(ROOT, OUT_DIR);
  console.log(summary);
  console.log('');
  console.log(`${verb} ${outRel}/sbom.cdx.json${suffix}`);
  console.log(`${verb} ${outRel}/summary.md${suffix}`);
  console.log(`${verb} ${outRel}/summary.json${suffix}`);

  if (denied.length > 0) {
    console.error(
      `\nDENIED: ${denied.length} package(s) use an explicitly denied license.`
    );
    process.exit(1);
  }

  process.exit(0);
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main();
}
