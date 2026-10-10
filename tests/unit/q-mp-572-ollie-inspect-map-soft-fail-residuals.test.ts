/**
 * q-mp-572 — Characterize `ollie-inspect-map` soft-fail residuals (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1012` @ `ed034b44`):
 *   `ollie-inspect-map.ts` **180** LOC (matches backlog stamp)
 *   Dedicated `*ollie*` unit files before this suite: **5**
 *     (`ollie-inspect-map`, wave40×3, `mutation-ui19`) — backlog “3 test-name
 *     matches” is stale after tip-folded `#1010` / wave40; residual soft-fail
 *     matrix after those is still thin (0 dedicated soft-fail residual files).
 *   Overlay nullish residual **2** (`data-player || 'unknown'` ×2) — do **not**
 *     clear (leave undrafted `q-mp-357` / older nullish ollie owners).
 *   Branch coverage **97.05%** (66/68); only unreachable `never` defaults remain
 *     — soft-fail residual value is contract ownership, not hole-filling.
 *
 * Ownership (leave alone; do not edit product / competing suites):
 *   Tip-folded `#1010` / `q-mp-548` — finite-pair `&&` kills + star-piece empty
 *     `||` — **do not re-add** those pins
 *   Tip-folded `#1002` / `q-mp-547` — empty `data-shape`, star-space missing
 *     player, unknown-chrome stub prefix, never-default docs
 *   Wave40 chrome / priority / stub-speech — leave alone
 *   Undrafted `q-mp-357` nullish ollie clear — leave **contained**
 *   Mutation `569` / engine `568` — keep this file on soft-fail residuals only
 *
 * This suite owns soft-fail residual contracts still thin after those:
 *   source keep-sites (nullish `||` pair, truthy shape/nodeId gates, finite
 *     pair gates, chrome closest order), star-space empty-string player,
 *     star-piece attribute-required selector soft-miss, partial axial / row-col
 *     attr soft-miss, nested child walk-up, chrome priority residuals beyond
 *     wave40 help-in-row / wave55 new-game-in-header, empty-shape bank wrapping
 *     axial cell fallthrough-then-cell, inspectDropSpeech STUB prefix on
 *     fallthrough (structural; no copy body pins).
 *
 * Constraints: tests only; zero `src/` edits; no nullish ceiling write; no AI /
 * rules / scoring / copy / aria pins; Hex Hard 450ms; no network; no ratchet
 * JSON.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

import {
  inspectDropSpeech,
  resolveInspectTarget,
} from '../../src/core/owl/ollie-inspect-map';

const OLLIE_SRC = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../../src/core/owl/ollie-inspect-map.ts'
  ),
  'utf8'
);

afterEach(() => {
  document.body.innerHTML = '';
});

// =============================================================================
// 1. Source soft-fail keep-sites
// =============================================================================

describe('q-mp-572 ollie-inspect-map — source soft-fail keep-sites', () => {
  it('keeps exactly two data-player || unknown nullish soft-fail arms', () => {
    // Overlay prefer-nullish-coalescing residual **2** — leave q-mp-357.
    const playerFalls =
      OLLIE_SRC.match(/getAttribute\('data-player'\)\s*\|\|\s*'unknown'/g) ??
      [];
    expect(playerFalls).toHaveLength(2);
  });

  it('keeps truthy shape / nodeId gates + finite pair soft-fail arms', () => {
    // Behavioral empty-shape / empty-nodeId / bad-finite pins stay with
    // tip-folded #1002 / #1010 / wave40 — this suite only locks keep-sites.
    expect(OLLIE_SRC).toMatch(
      /const shape = bankBtn\.getAttribute\('data-shape'\);/
    );
    expect(OLLIE_SRC).toMatch(/if \(shape\) \{/);
    expect(OLLIE_SRC).toMatch(
      /const nodeId = fiarNode\.getAttribute\('data-node-id'\);/
    );
    expect(OLLIE_SRC).toMatch(/if \(nodeId\) \{/);
    expect(OLLIE_SRC).toMatch(/Number\.isFinite\(q\) && Number\.isFinite\(r\)/);
    expect(OLLIE_SRC).toMatch(
      /Number\.isFinite\(row\) && Number\.isFinite\(col\)/
    );
    expect(OLLIE_SRC).toMatch(/Number\.isFinite\(space\)/);
  });

  it('keeps chrome closest order + null el early unknown soft-fail', () => {
    expect(OLLIE_SRC).toMatch(/if \(!el\) \{\s*return \{ kind: 'unknown' \};/);
    const helpIdx = OLLIE_SRC.indexOf("el.closest('#help-btn')");
    const tutorialIdx = OLLIE_SRC.indexOf("el.closest('#tutorial-btn')");
    const newGameIdx = OLLIE_SRC.indexOf("el.closest('#new-game-btn')");
    const backIdx = OLLIE_SRC.indexOf("el.closest('#back-btn')");
    const rowIdx = OLLIE_SRC.indexOf("el.closest('.button-row')");
    const headerIdx = OLLIE_SRC.indexOf("el.closest('.game-header')");
    expect(helpIdx).toBeGreaterThan(-1);
    expect(tutorialIdx).toBeGreaterThan(helpIdx);
    expect(newGameIdx).toBeGreaterThan(tutorialIdx);
    expect(backIdx).toBeGreaterThan(newGameIdx);
    expect(rowIdx).toBeGreaterThan(backIdx);
    expect(headerIdx).toBeGreaterThan(rowIdx);
  });

  it('keeps exhaustive never defaults as documented unreachable soft residuals', () => {
    // Coverage residual L148–149 / L171–172 — leave documented (r19/r20).
    const neverArms = OLLIE_SRC.match(/const _exhaustive: never = /g) ?? [];
    expect(neverArms).toHaveLength(2);
  });
});

// =============================================================================
// 2. Nullish player soft-fail residuals (orthogonal to tip-folded pins)
// =============================================================================

describe('q-mp-572 ollie-inspect-map — player || unknown residuals', () => {
  it('star-space empty-string data-player soft-falls to unknown player', () => {
    // Tip-folded #1002 pins omitted data-player; this pins empty-string arm.
    const space = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
    space.setAttribute('class', 'star-track-space');
    space.setAttribute('data-space', '5');
    space.setAttribute('data-player', '');
    document.body.appendChild(space);
    expect(resolveInspectTarget(space)).toEqual({
      kind: 'star-space',
      space: 5,
      player: 'unknown',
    });
  });

  it('star-piece without data-player attr soft-misses selector → unknown', () => {
    // Selector requires [data-player]; missing attr ≠ empty-string pin (#1010).
    const piece = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
    piece.setAttribute('class', 'star-track-piece');
    // intentionally omit data-player
    document.body.appendChild(piece);
    expect(resolveInspectTarget(piece)).toEqual({ kind: 'unknown' });
  });
});

// =============================================================================
// 3. Partial-attr selector soft-miss residuals
// =============================================================================

describe('q-mp-572 ollie-inspect-map — partial-attr soft-miss residuals', () => {
  it('axial element with only data-q soft-misses hag-cell selector', () => {
    const el = document.createElement('div');
    el.setAttribute('data-q', '1');
    document.body.appendChild(el);
    expect(resolveInspectTarget(el)).toEqual({ kind: 'unknown' });
  });

  it('axial element with only data-r soft-misses hag-cell selector', () => {
    const el = document.createElement('div');
    el.setAttribute('data-r', '2');
    document.body.appendChild(el);
    expect(resolveInspectTarget(el)).toEqual({ kind: 'unknown' });
  });

  it('kings .cell with data-row but no data-col soft-misses selector', () => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.setAttribute('data-row', '3');
    document.body.appendChild(cell);
    expect(resolveInspectTarget(cell)).toEqual({ kind: 'unknown' });
  });

  it('hex-cell-group with data-col but no data-row soft-misses selector', () => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'hex-cell-group');
    g.setAttribute('data-col', '2');
    document.body.appendChild(g);
    expect(resolveInspectTarget(g)).toEqual({ kind: 'unknown' });
  });
});

// =============================================================================
// 4. Walk-up + empty-shape fallthrough-then-cell residuals
// =============================================================================

describe('q-mp-572 ollie-inspect-map — walk-up / fallthrough residuals', () => {
  it('nested child inside kings cell walks up to kings-cell', () => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.setAttribute('data-row', '1');
    cell.setAttribute('data-col', '4');
    const child = document.createElement('span');
    child.className = 'q572-inner';
    cell.appendChild(child);
    document.body.appendChild(cell);
    expect(resolveInspectTarget(child)).toEqual({
      kind: 'kings-cell',
      row: 1,
      col: 4,
    });
  });

  it('nested child inside fiar node walks up to fiar-node', () => {
    const node = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    node.setAttribute('data-node-id', 'n-q572');
    const child = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
    node.appendChild(child);
    document.body.appendChild(node);
    expect(resolveInspectTarget(child)).toEqual({
      kind: 'fiar-node',
      nodeId: 'n-q572',
    });
  });

  it('empty data-shape bank wrapping axial cell falls through then resolves cell', () => {
    // Empty shape fails truthy gate (#1002 owns bare empty bank → unknown);
    // with a nested axial cell the walk continues to hag-cell — thin residual.
    const bank = document.createElement('div');
    bank.setAttribute('data-shape', '');
    const cell = document.createElement('div');
    cell.setAttribute('data-q', '0');
    cell.setAttribute('data-r', '-1');
    bank.appendChild(cell);
    document.body.appendChild(bank);
    expect(resolveInspectTarget(cell)).toEqual({
      kind: 'hex-a-gone-cell',
      q: 0,
      r: -1,
    });
  });

  it('finite zero axial coords soft-accept through Number.isFinite gates', () => {
    const cell = document.createElement('div');
    cell.setAttribute('data-q', '0');
    cell.setAttribute('data-r', '0');
    document.body.appendChild(cell);
    expect(resolveInspectTarget(cell)).toEqual({
      kind: 'hex-a-gone-cell',
      q: 0,
      r: 0,
    });
  });
});

// =============================================================================
// 5. Chrome priority residuals beyond wave40 / wave55
// =============================================================================

describe('q-mp-572 ollie-inspect-map — chrome priority residuals', () => {
  it('tutorial-btn inside button-row prefers tutorial over button-row', () => {
    // Wave40 pins help-in-row only.
    const row = document.createElement('div');
    row.className = 'button-row';
    const btn = document.createElement('button');
    btn.id = 'tutorial-btn';
    row.appendChild(btn);
    document.body.appendChild(row);
    expect(resolveInspectTarget(btn)).toEqual({
      kind: 'chrome',
      chrome: 'tutorial',
    });
  });

  it('back-btn inside game-header prefers back over game-header', () => {
    // Wave55 pins new-game-in-header only.
    const header = document.createElement('header');
    header.className = 'game-header';
    const btn = document.createElement('button');
    btn.id = 'back-btn';
    header.appendChild(btn);
    document.body.appendChild(header);
    expect(resolveInspectTarget(btn)).toEqual({
      kind: 'chrome',
      chrome: 'back',
    });
  });

  it('button-row nested in game-header prefers button-row over header', () => {
    const header = document.createElement('header');
    header.className = 'game-header';
    const row = document.createElement('div');
    row.className = 'button-row';
    const inner = document.createElement('span');
    row.appendChild(inner);
    header.appendChild(row);
    document.body.appendChild(header);
    expect(resolveInspectTarget(inner)).toEqual({
      kind: 'chrome',
      chrome: 'button-row',
    });
  });
});

// =============================================================================
// 6. inspectDropSpeech soft-fail prefix (structural; no copy body pins)
// =============================================================================

describe('q-mp-572 ollie-inspect-map — inspectDropSpeech soft-fail prefix', () => {
  it('fallthrough targets still return STUB-prefixed speech strings', () => {
    const partial = document.createElement('div');
    partial.setAttribute('data-q', '9');
    document.body.appendChild(partial);
    const speech = inspectDropSpeech(partial);
    expect(typeof speech).toBe('string');
    expect(speech.startsWith('[STUB inspect]')).toBe(true);
    expect(speech.length).toBeGreaterThan(20);
  });

  it('star-piece selector soft-miss speech stays STUB-prefixed unknown', () => {
    const piece = document.createElement('div');
    piece.className = 'star-track-piece';
    document.body.appendChild(piece);
    const speech = inspectDropSpeech(piece);
    expect(speech.startsWith('[STUB inspect]')).toBe(true);
    expect(resolveInspectTarget(piece)).toEqual({ kind: 'unknown' });
  });
});
