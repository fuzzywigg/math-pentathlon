import { describe, it, expect } from 'vitest';
import {
  flattenKnip,
  dynamicImportHitsGameId,
  publicNamesFromExportBrace,
} from '../../scripts/report-dead-code.mjs';

describe('report-dead-code flattenKnip (q-mp-1255)', () => {
  it('skips null and non-object files entries without throwing', () => {
    expect(() => flattenKnip({ files: [null] })).not.toThrow();
    const rows = flattenKnip({
      files: [
        null,
        undefined,
        42,
        true,
        { notFile: 'x.ts' },
        { file: null },
        'src/ok-string.ts',
        { file: 'src/ok-object.ts' },
      ],
    });
    expect(rows).toEqual([
      { kind: 'file', path: 'src/ok-string.ts', source: 'knip' },
      { kind: 'file', path: 'src/ok-object.ts', source: 'knip' },
    ]);
  });

  it('still flattens string and {file} shapes', () => {
    expect(flattenKnip({ files: ['a.ts', { file: 'b.ts' }] })).toEqual([
      { kind: 'file', path: 'a.ts', source: 'knip' },
      { kind: 'file', path: 'b.ts', source: 'knip' },
    ]);
  });
});

describe('report-dead-code flattenKnip (q-mp-1274)', () => {
  it('skips null and non-object issues rows without throwing', () => {
    expect(() => flattenKnip({ issues: [null] })).not.toThrow();
    const rows = flattenKnip({
      issues: [
        null,
        undefined,
        42,
        'not-an-issue',
        { file: null },
        { file: '' },
        { file: 'a.ts', exports: [{ name: 'kept' }] },
      ],
    });
    expect(rows).toEqual([
      { kind: 'export', path: 'a.ts', symbol: 'kept', source: 'knip' },
    ]);
  });

  it('skips null nested exports / types / dependencies entries', () => {
    expect(() =>
      flattenKnip({
        issues: [{ file: 'a.ts', exports: [null] }],
      })
    ).not.toThrow();
    const rows = flattenKnip({
      issues: [
        {
          file: 'a.ts',
          exports: [
            null,
            undefined,
            7,
            { name: null },
            'expStr',
            { name: 'expObj' },
          ],
          types: [null, 'TypStr', { name: 'TypObj' }],
          dependencies: [null, 'depStr', { name: 'depObj' }],
          devDependencies: [null, 'devStr', { name: 'devObj' }],
        },
      ],
    });
    expect(rows).toEqual([
      { kind: 'export', path: 'a.ts', symbol: 'expStr', source: 'knip' },
      { kind: 'export', path: 'a.ts', symbol: 'expObj', source: 'knip' },
      { kind: 'unused-type', path: 'a.ts', symbol: 'TypStr', source: 'knip' },
      { kind: 'unused-type', path: 'a.ts', symbol: 'TypObj', source: 'knip' },
      {
        kind: 'dependency',
        path: 'package.json',
        symbol: 'depStr',
        source: 'knip',
      },
      {
        kind: 'dependency',
        path: 'package.json',
        symbol: 'depObj',
        source: 'knip',
      },
      {
        kind: 'dependency',
        path: 'package.json',
        symbol: 'devStr',
        detail: 'devDependency',
        source: 'knip',
      },
      {
        kind: 'dependency',
        path: 'package.json',
        symbol: 'devObj',
        detail: 'devDependency',
        source: 'knip',
      },
    ]);
  });
});

describe('report-dead-code dynamicImportHitsGameId (q-mp-1256)', () => {
  it('does not treat hex ⊂ hex-a-gone as a hit', () => {
    expect(dynamicImportHitsGameId('../games/hex-a-gone/index', 'hex')).toBe(
      false
    );
    expect(dynamicImportHitsGameId('../games/hex-a-gone/ai', 'hex')).toBe(
      false
    );
  });

  it('hits real games/hex path segments', () => {
    expect(dynamicImportHitsGameId('../games/hex/index', 'hex')).toBe(true);
    expect(dynamicImportHitsGameId('../games/hex/ai', 'hex')).toBe(true);
    expect(dynamicImportHitsGameId('games/hex', 'hex')).toBe(true);
  });

  it('still hits hex-a-gone for its own id', () => {
    expect(
      dynamicImportHitsGameId('../games/hex-a-gone/index', 'hex-a-gone')
    ).toBe(true);
  });
});

describe('report-dead-code publicNamesFromExportBrace (q-mp-1257)', () => {
  it('records the public name of export { a as b }', () => {
    expect(publicNamesFromExportBrace(' helper as usefulHelper ')).toEqual([
      'usefulHelper',
    ]);
    expect(
      publicNamesFromExportBrace('foo, helper as usefulHelper, bar')
    ).toEqual(['foo', 'usefulHelper', 'bar']);
  });

  it('keeps export { foo } unchanged', () => {
    expect(publicNamesFromExportBrace('foo')).toEqual(['foo']);
    expect(publicNamesFromExportBrace(' foo , bar ')).toEqual(['foo', 'bar']);
  });

  it('strips type keyword before the public name', () => {
    expect(publicNamesFromExportBrace('type Foo')).toEqual(['Foo']);
    expect(publicNamesFromExportBrace('type Foo as Bar')).toEqual(['Bar']);
  });
});
