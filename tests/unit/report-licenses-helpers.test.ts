import { describe, it, expect } from 'vitest';
import {
  normalizeLicense,
  classifyLicense,
  npmPackageNameFromLockPath,
  collectPackagesFromLock,
  countByLicense,
  buildCycloneDxBom,
  inventoryBundledAssets,
  findUncataloguedPublicMedia,
  BUNDLED_ASSET_CATALOG,
} from '../../scripts/report-licenses.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);

describe('report-licenses helpers', () => {
  it('normalizes string and SPDX object licenses', () => {
    expect(normalizeLicense('MIT')).toBe('MIT');
    expect(normalizeLicense({ type: 'Apache-2.0' })).toBe('Apache-2.0');
    expect(normalizeLicense(['MIT', 'Apache-2.0'])).toBe('MIT OR Apache-2.0');
    expect(normalizeLicense(null)).toBe('');
  });

  it('classifies denied, copyleft/review, unknown, and ok licenses', () => {
    expect(classifyLicense('GPL-3.0')).toBe('denied');
    expect(classifyLicense('GPL-2.0')).toBe('denied');
    // Legacy npm spellings (q-mp-1054)
    expect(classifyLicense('GPLv2')).toBe('denied');
    expect(classifyLicense('GPLv3')).toBe('denied');
    expect(classifyLicense('GPL')).toBe('denied');
    expect(classifyLicense('GNU GPL')).toBe('denied');
    expect(classifyLicense('AGPL-3.0-only')).toBe('denied');
    expect(classifyLicense('SSPL-1.0')).toBe('denied');
    expect(classifyLicense('BUSL-1.1')).toBe('denied');
    // Legacy / prose copyleft beyond short GPL (q-mp-1079)
    expect(classifyLicense('AGPLv3')).toBe('denied');
    expect(classifyLicense('GNU General Public License v3.0')).toBe('denied');
    expect(classifyLicense('GNU General Public License v2.0')).toBe('denied');
    expect(classifyLicense('Server Side Public License')).toBe('denied');
    expect(classifyLicense('Business Source License 1.1')).toBe('denied');
    // Affero / GNU Affero prose (q-mp-1127); SPDX AGPL-* already denied
    expect(classifyLicense('GNU Affero General Public License v3.0')).toBe(
      'denied'
    );
    expect(classifyLicense('Affero General Public License')).toBe('denied');
    expect(classifyLicense('AGPL-3.0')).toBe('denied');
    // CPAL prose (q-mp-1131); SPDX CPAL-* already denied; not CPL (1103)
    expect(classifyLicense('Common Public Attribution License 1.0')).toBe(
      'denied'
    );
    expect(
      classifyLicense('Common Public Attribution License Version 1.0')
    ).toBe('denied');
    expect(classifyLicense('CPAL-1.0')).toBe('denied');
    expect(classifyLicense('MPL-2.0')).toBe('copyleft_or_review');
    expect(classifyLicense('LGPL-2.1')).toBe('copyleft_or_review');
    expect(classifyLicense('LGPLv2.1')).toBe('copyleft_or_review');
    expect(classifyLicense('LGPLv3')).toBe('copyleft_or_review');
    expect(classifyLicense('LGPL-3.0')).toBe('copyleft_or_review');
    // GNU Lesser / Library GPL prose (q-mp-1128)
    expect(classifyLicense('GNU Lesser General Public License v3.0')).toBe(
      'copyleft_or_review'
    );
    expect(classifyLicense('GNU Library General Public License')).toBe(
      'copyleft_or_review'
    );
    expect(classifyLicense('MPLv2')).toBe('copyleft_or_review');
    expect(classifyLicense('Mozilla Public License 2.0')).toBe(
      'copyleft_or_review'
    );
    expect(classifyLicense('Python-2.0')).toBe('copyleft_or_review');
    // CPL SPDX + Common Public License prose (q-mp-1103)
    expect(classifyLicense('CPL-1.0')).toBe('copyleft_or_review');
    expect(classifyLicense('Common Public License 1.0')).toBe(
      'copyleft_or_review'
    );
    // Eclipse Public License prose (q-mp-1104); SPDX EPL-* already covered
    expect(classifyLicense('EPL-1.0')).toBe('copyleft_or_review');
    expect(classifyLicense('EPL-2.0')).toBe('copyleft_or_review');
    expect(classifyLicense('Eclipse Public License - v 2.0')).toBe(
      'copyleft_or_review'
    );
    expect(classifyLicense('Eclipse Public License v1.0')).toBe(
      'copyleft_or_review'
    );
    // EUPL / OSL prose (q-mp-1129); SPDX short forms already review
    expect(classifyLicense('European Union Public License 1.2')).toBe(
      'copyleft_or_review'
    );
    expect(classifyLicense('Open Software License 3.0')).toBe(
      'copyleft_or_review'
    );
    expect(classifyLicense('EUPL-1.2')).toBe('copyleft_or_review');
    expect(classifyLicense('OSL-3.0')).toBe('copyleft_or_review');
    expect(classifyLicense('')).toBe('unknown');
    expect(classifyLicense('UNLICENSED')).toBe('unknown');
    // Bare / URL Custom* must not be ok (q-mp-1102)
    expect(classifyLicense('Custom')).toBe('unknown');
    expect(classifyLicense('custom')).toBe('unknown');
    expect(classifyLicense('Custom: https://x.test/lic')).toBe('unknown');
    // OR forms with unknown/proprietary tokens must not be ok (q-mp-1080)
    expect(classifyLicense('UNLICENSED OR MIT')).toBe('unknown');
    expect(classifyLicense('MIT OR UNLICENSED')).toBe('unknown');
    expect(classifyLicense('PROPRIETARY OR MIT')).toBe('unknown');
    expect(classifyLicense('NONE OR Apache-2.0')).toBe('unknown');
    expect(classifyLicense('UNKNOWN OR MIT')).toBe('unknown');
    expect(classifyLicense('Custom OR MIT')).toBe('unknown');
    // American SEE LICENSE + British SEE LICENCE (q-mp-1130)
    expect(classifyLicense('SEE LICENSE IN COPYING')).toBe('unknown');
    expect(classifyLicense('SEE LICENCE IN COPYING')).toBe('unknown');
    expect(classifyLicense('see licence in copying')).toBe('unknown');
    expect(classifyLicense('MIT')).toBe('ok');
    expect(classifyLicense('Apache-2.0')).toBe('ok');
    expect(classifyLicense('(MIT OR CC0-1.0)')).toBe('ok');
    // q-mp-1081 HOLD-CHECK: source-available / proprietary prose stay ok here
    expect(classifyLicense('Elastic-2.0')).toBe('ok');
    expect(classifyLicense('LicenseRef-Proprietary')).toBe('ok');
    expect(classifyLicense('Commercial')).toBe('ok');
    // q-mp-1105 HOLD-CHECK: CDDL long prose / MS-RL stay ok here (SPDX CDDL ok→review)
    expect(classifyLicense('CDDL-1.1')).toBe('copyleft_or_review');
    expect(classifyLicense('Common Development and Distribution License')).toBe(
      'ok'
    );
    expect(classifyLicense('MS-RL')).toBe('ok');
  });

  it('extracts npm names from lock paths including nested scoped packages', () => {
    expect(npmPackageNameFromLockPath('node_modules/three')).toBe('three');
    expect(npmPackageNameFromLockPath('node_modules/@playwright/test')).toBe(
      '@playwright/test'
    );
    expect(
      npmPackageNameFromLockPath(
        'node_modules/@axe-core/playwright/node_modules/axe-core'
      )
    ).toBe('axe-core');
  });

  // q-mp-1284: trailing slash on lock paths must not pollute package names
  it('strips trailing slashes from lock-path package names (q-mp-1284)', () => {
    expect(npmPackageNameFromLockPath('node_modules/lodash/')).toBe('lodash');
    expect(npmPackageNameFromLockPath('node_modules/@scope/pkg/')).toBe(
      '@scope/pkg'
    );
    expect(npmPackageNameFromLockPath('node_modules/@scope/')).toBe('@scope');
    expect(npmPackageNameFromLockPath('node_modules/lodash')).toBe('lodash');
    expect(npmPackageNameFromLockPath('node_modules/@scope/pkg')).toBe(
      '@scope/pkg'
    );
    expect(npmPackageNameFromLockPath('')).toBe('');
    expect(npmPackageNameFromLockPath('not-a-lock-path')).toBe(
      'not-a-lock-path'
    );
  });

  it('collects packages from a lockfile fixture and counts licenses', () => {
    const lock = {
      packages: {
        '': { name: 'demo', version: '1.0.0' },
        'node_modules/three': {
          version: '0.1.0',
          license: 'MIT',
          resolved: 'https://example.test/three.tgz',
          integrity: 'sha512-YWJj',
        },
        'node_modules/axe-core': {
          version: '4.0.0',
          license: 'MPL-2.0',
          dev: true,
        },
        'node_modules/evil': {
          version: '1.0.0',
          license: 'GPL-3.0',
          dev: true,
        },
        'node_modules/esbuild': {
          version: '0.28.0',
          license: 'MIT',
          dev: true,
          hasInstallScript: true,
        },
        'node_modules/mystery': {
          version: '1.0.0',
          dev: true,
        },
      },
    };

    const pkgs = collectPackagesFromLock(lock);
    expect(pkgs).toHaveLength(5);
    expect(pkgs.filter((p) => p.production)).toHaveLength(1);
    expect(pkgs.find((p) => p.name === 'axe-core')?.classification).toBe(
      'copyleft_or_review'
    );
    expect(pkgs.find((p) => p.name === 'evil')?.classification).toBe('denied');
    expect(pkgs.find((p) => p.name === 'mystery')?.classification).toBe(
      'unknown'
    );
    expect(pkgs.find((p) => p.name === 'esbuild')?.hasInstallScript).toBe(true);

    const counts = countByLicense(pkgs);
    expect(counts.MIT).toBe(2);
    expect(counts['MPL-2.0']).toBe(1);
    expect(counts['GPL-3.0']).toBe(1);
    expect(counts['(missing)']).toBe(1);
  });

  it('builds a CycloneDX 1.5 document with npm + asset components', () => {
    const packages = collectPackagesFromLock({
      packages: {
        '': {},
        'node_modules/three': {
          version: '0.186.1',
          license: 'MIT',
          resolved: 'https://registry.npmjs.org/three/-/three-0.186.1.tgz',
          integrity:
            'sha512-blFeqb49wRCSGUGj7gtpfnSGHy2lwDk94RhUmS1c/hTby70kvChbWpkJ4Pm1390LqzzvTmzgXKXPEafJwCb8jA==',
        },
      },
    });
    const assets = [
      {
        path: 'public/fonts/inter-latin-400-normal.woff2',
        kind: 'font' as const,
        name: 'Inter (latin 400)',
        license: 'OFL-1.1',
        licenseSource: 'SIL OFL 1.1',
        thirdParty: true,
        exists: true,
        bytes: 10,
        sha256: 'abc',
      },
    ];
    const bom = buildCycloneDxBom({
      name: 'math-pentathlon',
      version: '1.0.0',
      packages,
      assets,
    });
    expect(bom.bomFormat).toBe('CycloneDX');
    expect(bom.specVersion).toBe('1.5');
    expect(bom.components.length).toBe(2);
    expect(bom.components[0]!.purl).toBe('pkg:npm/three@0.186.1');
    expect(bom.components[0]!['bom-ref']).toBe('pkg:npm/three@0.186.1');
    expect(bom.components[0]!.licenses).toEqual([{ expression: 'MIT' }]);
    expect(bom.components[1]!['bom-ref']).toBe(
      'file:public/fonts/inter-latin-400-normal.woff2'
    );
  });

  // q-mp-1281 / 1282 / 1283: CycloneDX bom-ref, integrity hashes, optional scope
  it('omits @ from bom-ref when version is empty (q-mp-1281)', () => {
    const bom = buildCycloneDxBom({
      name: 'app',
      version: '0',
      packages: [
        {
          lockPath: 'node_modules/x',
          name: 'x',
          version: '',
          license: 'MIT',
          licenseSource: 'lockfile',
          production: true,
          optional: false,
          hasInstallScript: false,
          resolved: '',
          integrity: '',
          classification: 'ok',
        },
      ],
      assets: [],
    });
    expect(bom.components[0]!['bom-ref']).toBe('pkg:npm/x');
    expect(bom.components[0]!.purl).toBe('pkg:npm/x');
  });

  it('skips invalid / empty integrity hashes (q-mp-1282)', () => {
    // sha256("hello") — hardcoded so the test stays free of Node Buffer types
    // (file is in typecheck:ratchet scope).
    const sha256Hex =
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824';
    const validB64 = 'LPJNul+wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ=';
    const packages = [
      {
        lockPath: 'node_modules/bad',
        name: 'bad',
        version: '1.0.0',
        license: 'MIT',
        licenseSource: 'lockfile' as const,
        production: true,
        optional: false,
        hasInstallScript: false,
        resolved: '',
        integrity: 'sha256-@@@@',
        classification: 'ok' as const,
      },
      {
        lockPath: 'node_modules/short',
        name: 'short',
        version: '1.0.0',
        license: 'MIT',
        licenseSource: 'lockfile' as const,
        production: true,
        optional: false,
        hasInstallScript: false,
        resolved: '',
        integrity: 'sha512-YWJj',
        classification: 'ok' as const,
      },
      {
        lockPath: 'node_modules/good',
        name: 'good',
        version: '1.0.0',
        license: 'MIT',
        licenseSource: 'lockfile' as const,
        production: true,
        optional: false,
        hasInstallScript: false,
        resolved: '',
        integrity: `sha256-${validB64}`,
        classification: 'ok' as const,
      },
    ];
    const bom = buildCycloneDxBom({
      name: 'app',
      version: '0',
      packages,
      assets: [],
    });
    expect(bom.components[0]!.hashes).toBeUndefined();
    expect(bom.components[1]!.hashes).toBeUndefined();
    expect(bom.components[2]!.hashes).toEqual([
      { alg: 'SHA-256', content: sha256Hex },
    ]);
  });

  it('sets CycloneDX scope optional when package.optional is true (q-mp-1283)', () => {
    const base = {
      lockPath: 'node_modules/x',
      name: 'x',
      version: '1.0.0',
      license: 'MIT',
      licenseSource: 'lockfile' as const,
      hasInstallScript: false,
      resolved: '',
      integrity: '',
      classification: 'ok' as const,
    };
    const bom = buildCycloneDxBom({
      name: 'app',
      version: '0',
      packages: [
        { ...base, production: true, optional: true },
        {
          ...base,
          name: 'y',
          lockPath: 'node_modules/y',
          production: true,
          optional: false,
        },
        {
          ...base,
          name: 'z',
          lockPath: 'node_modules/z',
          production: false,
          optional: false,
        },
      ],
      assets: [],
    });
    expect(bom.components[0]!.scope).toBe('optional');
    expect(bom.components[1]!.scope).toBe('required');
    expect(bom.components[2]!.scope).toBe('optional');
  });

  it('inventories catalogued public assets on disk', () => {
    const assets = inventoryBundledAssets(rootDir);
    expect(assets.length).toBe(BUNDLED_ASSET_CATALOG.length);
    expect(assets.every((a) => a.exists)).toBe(true);
    const fonts = assets.filter((a) => a.kind === 'font');
    expect(fonts).toHaveLength(4);
    expect(fonts.every((a) => a.thirdParty && a.license === 'OFL-1.1')).toBe(
      true
    );
    const icons = assets.filter((a) => a.kind === 'icon' || a.kind === 'image');
    expect(icons.every((a) => !a.thirdParty)).toBe(true);
  });

  it('finds no uncatalogued public media in the live tree', () => {
    expect(findUncataloguedPublicMedia(rootDir)).toEqual([]);
  });
});
