import { describe, it, expect } from 'vitest';
import {
  parsePrecacheManifest,
  diffHashTrees,
  offlineNeededPaths,
  listChunkNames,
  PRECACHE_FONT_IGNORES,
  collectHtmlNonRootAssetRefs,
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
    expect(
      parsePrecacheManifest('{url:"/a.js",revision:42,size:12}')
    ).toEqual([{ url: '/a.js', revision: '42' }]);
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

  it('surfaces duplicate precache URLs when includeAssets overlaps globs', () => {
    const sw = `s.precacheAndRoute([{url:"favicon.ico",revision:"a"},{url:"index.html",revision:"b"},{url:"favicon.ico",revision:"a"}],{})`;
    const urls = parsePrecacheManifest(sw).map((e) => e.url);
    const counts = new Map<string, number>();
    for (const u of urls) counts.set(u, (counts.get(u) || 0) + 1);
    const duplicates = [...counts.entries()].filter(([, n]) => n > 1);
    expect(duplicates).toEqual([['favicon.ico', 2]]);
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
});
