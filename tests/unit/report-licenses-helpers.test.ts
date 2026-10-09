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

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

describe('report-licenses helpers', () => {
  it('normalizes string and SPDX object licenses', () => {
    expect(normalizeLicense('MIT')).toBe('MIT');
    expect(normalizeLicense({ type: 'Apache-2.0' })).toBe('Apache-2.0');
    expect(normalizeLicense(['MIT', 'Apache-2.0'])).toBe('MIT OR Apache-2.0');
    expect(normalizeLicense(null)).toBe('');
  });

  it('classifies denied, copyleft/review, unknown, and ok licenses', () => {
    expect(classifyLicense('GPL-3.0')).toBe('denied');
    expect(classifyLicense('AGPL-3.0-only')).toBe('denied');
    expect(classifyLicense('SSPL-1.0')).toBe('denied');
    expect(classifyLicense('MPL-2.0')).toBe('copyleft_or_review');
    expect(classifyLicense('Python-2.0')).toBe('copyleft_or_review');
    expect(classifyLicense('')).toBe('unknown');
    expect(classifyLicense('UNLICENSED')).toBe('unknown');
    expect(classifyLicense('MIT')).toBe('ok');
    expect(classifyLicense('Apache-2.0')).toBe('ok');
    expect(classifyLicense('(MIT OR CC0-1.0)')).toBe('ok');
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
    expect(bom.components[0]!.licenses).toEqual([{ expression: 'MIT' }]);
    expect(bom.components[1]!['bom-ref']).toBe(
      'file:public/fonts/inter-latin-400-normal.woff2'
    );
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
