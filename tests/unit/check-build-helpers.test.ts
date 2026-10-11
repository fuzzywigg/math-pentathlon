import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  parsePrecacheManifest,
  diffHashTrees,
  offlineNeededPaths,
  listChunkNames,
  PRECACHE_FONT_IGNORES,
  collectHtmlNonRootAssetRefs,
  isPrecacheAuditOk,
  scanEnvLeakage,
  hasHealthTxt,
} from '../../scripts/check-build.mjs';

describe('check-build helpers', () => {
  it('parses Workbox precache entries from minified sw.js', () => {
    const sw = `define(["./workbox-abc"],function(s){s.precacheAndRoute([{url:"index.html",revision:"aaa"},{url:"assets/game-hex-xyz.js",revision:null}],{})});`;
    expect(parsePrecacheManifest(sw)).toEqual([
      { url: 'index.html', revision: 'aaa' },
      { url: 'assets/game-hex-xyz.js', revision: null },
    ]);
  });

  it('accepts revision-first key order and single-quoted entries (q-mp-1058)', () => {
    expect(parsePrecacheManifest('{ revision: "1", url: "/a.js" }')).toEqual([
      { url: '/a.js', revision: '1' },
    ]);
    expect(parsePrecacheManifest("{ url: '/a.js', revision: '1' }")).toEqual([
      { url: '/a.js', revision: '1' },
    ]);
    expect(parsePrecacheManifest("{ revision: '1', url: '/a.js' }")).toEqual([
      { url: '/a.js', revision: '1' },
    ]);
    expect(parsePrecacheManifest('{ revision: null, url: "/a.js" }')).toEqual([
      { url: '/a.js', revision: null },
    ]);
    expect(parsePrecacheManifest(`{url:"/a.js",revision:"1"}`)).toEqual([
      { url: '/a.js', revision: '1' },
    ]);
  });

  it('accepts JSON-quoted "url" / "revision" keys (q-mp-1087)', () => {
    expect(parsePrecacheManifest('{"url":"/a.js","revision":"1"}')).toEqual([
      { url: '/a.js', revision: '1' },
    ]);
    expect(
      parsePrecacheManifest('{ "url": "/a.js", "revision": "1" }')
    ).toEqual([{ url: '/a.js', revision: '1' }]);
    expect(parsePrecacheManifest('{"revision":"1","url":"/a.js"}')).toEqual([
      { url: '/a.js', revision: '1' },
    ]);
    expect(parsePrecacheManifest('{"url":"/a.js","revision":null}')).toEqual([
      { url: '/a.js', revision: null },
    ]);
    expect(parsePrecacheManifest("{'url':'/a.js','revision':'1'}")).toEqual([
      { url: '/a.js', revision: '1' },
    ]);
    // Bare identifier path from q-mp-1058 still works alongside JSON keys.
    expect(parsePrecacheManifest('{url:"/b.js",revision:"2"}')).toEqual([
      { url: '/b.js', revision: '2' },
    ]);
  });

  it('accepts optional trailing commas in Workbox entries (q-mp-1098)', () => {
    expect(parsePrecacheManifest('{url: "/a.js", revision: "1",}')).toEqual([
      { url: '/a.js', revision: '1' },
    ]);
    expect(parsePrecacheManifest('{"url":"/a.js","revision":"1",}')).toEqual([
      { url: '/a.js', revision: '1' },
    ]);
    expect(parsePrecacheManifest('{ revision: "1", url: "/a.js", }')).toEqual([
      { url: '/a.js', revision: '1' },
    ]);
    expect(parsePrecacheManifest('{url: "/a.js", revision: null,}')).toEqual([
      { url: '/a.js', revision: null },
    ]);
    // No trailing comma still parses (folded 1058 / 1087).
    expect(parsePrecacheManifest('{url: "/a.js", revision: "1"}')).toEqual([
      { url: '/a.js', revision: '1' },
    ]);
  });

  it('accepts whitespace around bare keys and colons (q-mp-1099)', () => {
    expect(parsePrecacheManifest('{ url : "/a.js" , revision : "1" }')).toEqual(
      [{ url: '/a.js', revision: '1' }]
    );
    expect(parsePrecacheManifest('{ revision : "1" , url : "/a.js" }')).toEqual(
      [{ url: '/a.js', revision: '1' }]
    );
    expect(
      parsePrecacheManifest('{ "url" : "/a.js" , "revision" : "1" }')
    ).toEqual([{ url: '/a.js', revision: '1' }]);
    // Trailing comma (1098) + spaced keys coexist.
    expect(
      parsePrecacheManifest('{ url : "/a.js" , revision : "1" , }')
    ).toEqual([{ url: '/a.js', revision: '1' }]);
    // Compact bare path still works.
    expect(parsePrecacheManifest('{url:"/a.js",revision:"1"}')).toEqual([
      { url: '/a.js', revision: '1' },
    ]);
  });

  it('accepts whitespace around JSON-quoted keys (q-mp-1125)', () => {
    // Spaced JSON keys (formatter padding); tight JSON from 1087 still works.
    expect(
      parsePrecacheManifest('{ "url" : "/a.js" , "revision" : "1" }')
    ).toEqual([{ url: '/a.js', revision: '1' }]);
    expect(
      parsePrecacheManifest('{ "revision" : "1" , "url" : "/a.js" }')
    ).toEqual([{ url: '/a.js', revision: '1' }]);
    expect(parsePrecacheManifest('{"url":"/a.js","revision":"1"}')).toEqual([
      { url: '/a.js', revision: '1' },
    ]);
  });

  it('ignores optional Workbox integrity field (q-mp-1126)', () => {
    expect(
      parsePrecacheManifest('{url: "/a.js", revision: "1", integrity: null}')
    ).toEqual([{ url: '/a.js', revision: '1' }]);
    expect(
      parsePrecacheManifest('{url:"/a.js",revision:"1",integrity:"sha384-abc"}')
    ).toEqual([{ url: '/a.js', revision: '1' }]);
    expect(
      parsePrecacheManifest('{"url":"/a.js","revision":"1","integrity":null}')
    ).toEqual([{ url: '/a.js', revision: '1' }]);
    expect(
      parsePrecacheManifest('{ revision: "1", url: "/a.js", integrity: null }')
    ).toEqual([{ url: '/a.js', revision: '1' }]);
    // url/revision still required; integrity alone is not an entry.
    expect(parsePrecacheManifest('{integrity: null}')).toEqual([]);
    // Compact path without integrity still works.
    expect(parsePrecacheManifest('{url:"/a.js",revision:"1"}')).toEqual([
      { url: '/a.js', revision: '1' },
    ]);
  });

  it('ignores optional Workbox size field (q-mp-1149)', () => {
    expect(parsePrecacheManifest('{url:"/a.js",revision:"1",size:12}')).toEqual(
      [{ url: '/a.js', revision: '1' }]
    );
    expect(
      parsePrecacheManifest('{url:"/a.js",revision:"1",size:null}')
    ).toEqual([{ url: '/a.js', revision: '1' }]);
    expect(
      parsePrecacheManifest('{"url":"/a.js","revision":"1","size":12}')
    ).toEqual([{ url: '/a.js', revision: '1' }]);
    expect(
      parsePrecacheManifest('{url:"/a.js",revision:"1",integrity:null,size:12}')
    ).toEqual([{ url: '/a.js', revision: '1' }]);
    expect(
      parsePrecacheManifest(
        '{url:"/a.js",revision:"1",size:12,integrity:"sha384-x"}'
      )
    ).toEqual([{ url: '/a.js', revision: '1' }]);
    // Trailing comma after size (1098) still works.
    expect(
      parsePrecacheManifest('{url:"/a.js",revision:"1",size:12,}')
    ).toEqual([{ url: '/a.js', revision: '1' }]);
    expect(parsePrecacheManifest('{url:"/a.js",revision:"1"}')).toEqual([
      { url: '/a.js', revision: '1' },
    ]);
  });

  it('accepts finite numeric revision values and stringifies them (q-mp-1178)', () => {
    expect(parsePrecacheManifest('{url:"/a.js",revision:42}')).toEqual([
      { url: '/a.js', revision: '42' },
    ]);
    expect(parsePrecacheManifest('{url:"/a.js",revision:0}')).toEqual([
      { url: '/a.js', revision: '0' },
    ]);
    expect(parsePrecacheManifest('{"url":"/a.js","revision":42}')).toEqual([
      { url: '/a.js', revision: '42' },
    ]);
    expect(parsePrecacheManifest('{revision:0,url:"/a.js"}')).toEqual([
      { url: '/a.js', revision: '0' },
    ]);
    expect(parsePrecacheManifest('{revision:42,url:"/a.js"}')).toEqual([
      { url: '/a.js', revision: '42' },
    ]);
    // Numeric revision + folded size/integrity extras still parse.
    expect(parsePrecacheManifest('{url:"/a.js",revision:42,size:12}')).toEqual([
      { url: '/a.js', revision: '42' },
    ]);
    expect(
      parsePrecacheManifest('{url:"/a.js",revision:0,integrity:null}')
    ).toEqual([{ url: '/a.js', revision: '0' }]);
    // String / null paths unchanged.
    expect(parsePrecacheManifest('{url:"/a.js",revision:"1"}')).toEqual([
      { url: '/a.js', revision: '1' },
    ]);
    expect(parsePrecacheManifest('{url:"/a.js",revision:null}')).toEqual([
      { url: '/a.js', revision: null },
    ]);
    // Invalid revision shapes still drop the entry.
    expect(parsePrecacheManifest('{url:"/a.js",revision:true}')).toEqual([]);
    expect(parsePrecacheManifest('{url:"/a.js",revision:Infinity}')).toEqual(
      []
    );
    expect(parsePrecacheManifest('{url:"/a.js",revision:NaN}')).toEqual([]);
  });

  it('diffs hash trees for only-A / only-B / content', () => {
    const a = new Map([
      ['a.js', '111'],
      ['b.js', '222'],
    ]);
    const b = new Map([
      ['b.js', '999'],
      ['c.js', '333'],
    ]);
    expect(diffHashTrees(a, b)).toEqual({
      onlyA: ['a.js'],
      onlyB: ['c.js'],
      contentDiff: ['b.js'],
    });
  });

  it('lists JS/CSS chunk paths under assets/ and vendor/', () => {
    const tree = new Map([
      ['assets/index-abc.js', '1'],
      ['assets/ui-abc.css', '2'],
      ['vendor/three-abc.js', '3'],
      ['favicon.ico', '4'],
      ['assets/note.txt', '5'],
    ]);
    expect(listChunkNames(tree)).toEqual([
      'assets/index-abc.js',
      'assets/ui-abc.css',
      'vendor/three-abc.js',
    ]);
  });

  it('includes .mjs assets in listChunkNames (q-mp-1334)', () => {
    // offlineNeededPaths already covers .mjs; chunk-name diffs must match.
    const tree = new Map([
      ['assets/w.mjs', '1'],
      ['assets/a.js', '2'],
      ['assets/b.css', '3'],
      ['vendor/worker.mjs', '4'],
      ['favicon.ico', '5'],
      ['assets/note.txt', '6'],
    ]);
    expect(listChunkNames(tree)).toEqual([
      'assets/a.js',
      'assets/b.css',
      'assets/w.mjs',
      'vendor/worker.mjs',
    ]);
    expect(offlineNeededPaths(tree.keys())).toEqual(
      expect.arrayContaining(['assets/w.mjs', 'vendor/worker.mjs'])
    );
  });

  it('treats Inter weight ignores and deploy meta as not offline-needed', () => {
    const paths = [
      'assets/game-hex-abc.js',
      'fonts/inter-latin-400-normal.woff2',
      ...PRECACHE_FONT_IGNORES,
      '_headers',
      '_redirects',
      'sw.js',
      'workbox-deadbeef.js',
      'CNAME',
      'index.html',
    ];
    expect(offlineNeededPaths(paths)).toEqual([
      'assets/game-hex-abc.js',
      'fonts/inter-latin-400-normal.woff2',
      'index.html',
    ]);
  });

  it('requires shipped .mjs under dist for offline precache (q-mp-1226)', () => {
    // Hermetic path list: .mjs must join .js; .wasm/.webp stay out until shipped.
    expect(
      offlineNeededPaths([
        'assets/worker.mjs',
        'assets/app.js',
        'assets/x.wasm',
      ])
    ).toEqual(['assets/app.js', 'assets/worker.mjs']);
  });

  it('surfaces duplicate precache URLs when includeAssets overlaps globs', () => {
    const sw = `s.precacheAndRoute([{url:"favicon.ico",revision:"a"},{url:"index.html",revision:"b"},{url:"favicon.ico",revision:"a"}],{})`;
    const urls = parsePrecacheManifest(sw).map((e) => e.url);
    const counts = new Map<string, number>();
    for (const u of urls) counts.set(u, (counts.get(u) || 0) + 1);
    const duplicates = [...counts.entries()].filter(([, n]) => n > 1);
    expect(duplicates).toEqual([['favicon.ico', 2]]);
  });

  it('precache ok requires orderOk (q-mp-1225)', () => {
    // Hermetic composition: unsorted glob (orderOk false) must fail Precache OK
    // even when missing/notPrecached/duplicates are clean.
    const clean = {
      missingFromDist: [] as string[],
      notPrecached: [] as string[],
      duplicates: [] as string[],
    };
    expect(isPrecacheAuditOk({ ...clean, orderOk: true })).toBe(true);
    expect(isPrecacheAuditOk({ ...clean, orderOk: false })).toBe(false);
    expect(
      isPrecacheAuditOk({
        missingFromDist: ['gone.js'],
        notPrecached: [],
        duplicates: [],
        orderOk: true,
      })
    ).toBe(false);
  });

  it('collects single-quoted and double-quoted non-root asset refs (q-mp-1179)', () => {
    const html = [
      '<script src="./a.js"></script>',
      "<script src='./b.js'></script>",
      '<link href="./c.css">',
      "<link href='./d.css'>",
      '<script src="/root.js"></script>',
      "<link href='/root.css'>",
      '<a href="#skip">skip</a>',
      '<img src="data:image/gif;base64,AA">',
    ].join('');
    expect(collectHtmlNonRootAssetRefs(html)).toEqual([
      './a.js',
      './b.js',
      './c.css',
      './d.css',
    ]);
  });

  it('collects unquoted src/href non-root asset refs (q-mp-1335)', () => {
    const html = [
      '<script src=assets/x.js></script>',
      '<link href=assets/y.css>',
      '<script src="/root.js"></script>',
      '<script src="assets/quoted.js"></script>',
      "<script src='assets/single.js'></script>",
      '<a href=#skip>skip</a>',
    ].join('');
    expect(collectHtmlNonRootAssetRefs(html)).toEqual([
      'assets/x.js',
      'assets/y.css',
      'assets/quoted.js',
      'assets/single.js',
    ]);
  });

  it('honors ?query/#hash on relative asset refs (q-mp-1227)', () => {
    const html = [
      '<script src="assets/app.js?v=1"></script>',
      '<script src="assets/app.js#x"></script>',
      '<script src="assets/app.js"></script>',
      '<script src="/assets/root.js?v=1"></script>',
    ].join('');
    expect(collectHtmlNonRootAssetRefs(html)).toEqual([
      'assets/app.js?v=1',
      'assets/app.js#x',
      'assets/app.js',
    ]);
  });

  it('flags protocol-relative // URLs as non-root (q-mp-1228)', () => {
    const html = [
      '<script src="//cdn.example/app.js"></script>',
      '<script src="/assets/app.js"></script>',
      '<script src="assets/local.js"></script>',
    ].join('');
    expect(collectHtmlNonRootAssetRefs(html)).toEqual([
      '//cdn.example/app.js',
      'assets/local.js',
    ]);
  });

  it('scanEnvLeakage requires a real file:/// URL token, not substring theater (q-mp-1209)', () => {
    const dist = mkdtempSync(join(tmpdir(), 'check-build-leak-'));
    try {
      writeFileSync(
        join(dist, 'prose.js'),
        'const msg = "not a file:/// path";\n'
      );
      writeFileSync(
        join(dist, 'leak.js'),
        'const u = "file:///tmp/secret-asset";\n'
      );
      writeFileSync(join(dist, 'bare.js'), 'file:///\n');
      const findings = scanEnvLeakage(dist);
      expect(findings).toEqual([{ path: 'leak.js', finding: 'file:// URL' }]);
      expect(
        findings.some((f) => f.path === 'prose.js' || f.path === 'bare.js')
      ).toBe(false);
    } finally {
      rmSync(dist, { recursive: true, force: true });
    }
  });

  it('scanEnvLeakage scans .mjs and .cjs assets (q-mp-1356)', () => {
    const dist = mkdtempSync(join(tmpdir(), 'check-build-leak-mjs-'));
    try {
      // Flat fixture — ratchet node-minimal.d.ts has no mkdirSync.
      writeFileSync(join(dist, 'keep.json'), 'const x="/workspace/skip";\n');
      writeFileSync(join(dist, 'a.js'), 'const x="/workspace/secret";\n');
      writeFileSync(join(dist, 'b.mjs'), 'const x="/workspace/secret";\n');
      writeFileSync(join(dist, 'c.cjs'), 'const x="/workspace/secret";\n');
      writeFileSync(join(dist, 'ok.mjs'), 'const x="relative/path";\n');
      const findings = scanEnvLeakage(dist);
      expect(findings).toEqual(
        expect.arrayContaining([
          { path: 'a.js', finding: 'absolute /workspace path' },
          { path: 'b.mjs', finding: 'absolute /workspace path' },
          { path: 'c.cjs', finding: 'absolute /workspace path' },
        ])
      );
      expect(findings).toHaveLength(3);
      expect(findings.some((f) => f.path === 'keep.json')).toBe(false);
      expect(findings.some((f) => f.path === 'ok.mjs')).toBe(false);
    } finally {
      rmSync(dist, { recursive: true, force: true });
    }
  });

  it('collects relative poster and srcset asset refs (q-mp-1369)', () => {
    const html = [
      '<video poster="assets/p.png"></video>',
      "<video poster='assets/q.png'></video>",
      '<video poster=/root.png></video>',
      '<img srcset="assets/a.png 1x, assets/b.png 2x">',
      "<img srcset='assets/c.png 100w, /root-d.png 200w'>",
      '<img src="assets/quoted.png">',
      '<script src="assets/keep.js"></script>',
    ].join('');
    expect(collectHtmlNonRootAssetRefs(html)).toEqual([
      'assets/p.png',
      'assets/q.png',
      'assets/a.png',
      'assets/b.png',
      'assets/c.png',
      'assets/quoted.png',
      'assets/keep.js',
    ]);
  });

  it('hasHealthTxt reports presence of dist/health.txt (q-mp-1336)', () => {
    const dist = mkdtempSync(join(tmpdir(), 'check-build-health-'));
    try {
      expect(hasHealthTxt(dist)).toBe(false);
      writeFileSync(join(dist, 'health.txt'), 'ok\n');
      expect(hasHealthTxt(dist)).toBe(true);
    } finally {
      rmSync(dist, { recursive: true, force: true });
    }
  });
});
