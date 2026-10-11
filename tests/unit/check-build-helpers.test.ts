import { describe, it, expect } from 'vitest';
import {
  parsePrecacheManifest,
  diffHashTrees,
  offlineNeededPaths,
  listChunkNames,
  PRECACHE_FONT_IGNORES,
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
});
