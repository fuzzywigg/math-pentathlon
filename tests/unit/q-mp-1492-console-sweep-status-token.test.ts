/**
 * q-mp-1492: console-sweep settle must find multi-class `*-status ${player}`
 * nodes (class-token match, not attribute suffix). Hermetic jsdom stubs +
 * harness wiring — no Playwright / product edits.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  COMPUTER_OR_THINKING_RE,
  STATUS_ATTR_SUFFIX_SELECTOR,
  SETTLE_THINKING_SELECTOR,
  collectGameStatusNodes,
  documentHasSettleThinkingSignal,
  documentSettleThinkingCleared,
  elementHasGameStatusClass,
  firstGameStatusText,
  isGameStatusClassToken,
  sampleSettleThinkingFromRoot,
  sampleShowsSettleThinking,
} from '../../scripts/lib/console-sweep-settle.mjs';

const HARNESS = resolve(process.cwd(), 'scripts/console-sweep.mjs');
const LIB = resolve(process.cwd(), 'scripts/lib/console-sweep-settle.mjs');

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('class-token status scan (q-mp-1492)', () => {
  it('isGameStatusClassToken matches *-status tokens only', () => {
    expect(isGameStatusClassToken('stars-status')).toBe(true);
    expect(isGameStatusClassToken('ramrod-status')).toBe(true);
    expect(isGameStatusClassToken('player2')).toBe(false);
    expect(isGameStatusClassToken('status-ai-thinking')).toBe(false);
  });

  it('finds multi-class stars-status player2 that attribute-suffix misses', () => {
    const el = document.createElement('div');
    el.className = 'stars-status player2';
    el.textContent = 'Computer is thinking…';
    document.body.appendChild(el);

    // Measured baseline: CSS attribute suffix misses multi-class nodes.
    expect(document.querySelector(STATUS_ATTR_SUFFIX_SELECTOR)).toBeNull();
    expect(elementHasGameStatusClass(el)).toBe(true);
    expect(collectGameStatusNodes(document)).toEqual([el]);
    expect(firstGameStatusText(document)).toBe('Computer is thinking…');

    const snap = sampleSettleThinkingFromRoot(document);
    expect(snap.thinking).toBe(false);
    expect(snap.status).toBe('Computer is thinking…');
    expect(sampleShowsSettleThinking(snap)).toBe(true);
    expect(
      documentHasSettleThinkingSignal(
        document,
        SETTLE_THINKING_SELECTOR,
        COMPUTER_OR_THINKING_RE.source
      )
    ).toBe(true);
  });

  it('single-class control class="stars-status" still matches', () => {
    const el = document.createElement('div');
    el.className = 'stars-status';
    el.textContent = 'Computer is thinking…';
    document.body.appendChild(el);

    expect(document.querySelector(STATUS_ATTR_SUFFIX_SELECTOR)).toBe(el);
    expect(collectGameStatusNodes(document)).toEqual([el]);
    expect(
      documentHasSettleThinkingSignal(
        document,
        SETTLE_THINKING_SELECTOR,
        COMPUTER_OR_THINKING_RE.source
      )
    ).toBe(true);
  });

  it('matrix: ramrod / frac-fact / pent / remainder multi-class → HIT', () => {
    for (const cls of [
      'ramrod-status player1',
      'frac-status player2',
      'pent-status player1',
      'remainder-status player2',
    ]) {
      document.body.innerHTML = '';
      const el = document.createElement('div');
      el.className = cls;
      el.textContent = 'Computer is thinking…';
      document.body.appendChild(el);
      expect(document.querySelector(STATUS_ATTR_SUFFIX_SELECTOR)).toBeNull();
      expect(collectGameStatusNodes(document).length).toBe(1);
      expect(
        documentHasSettleThinkingSignal(
          document,
          SETTLE_THINKING_SELECTOR,
          COMPUTER_OR_THINKING_RE.source
        )
      ).toBe(true);
    }
  });

  it('soft-clears when multi-class status is no longer thinking', () => {
    const el = document.createElement('div');
    el.className = 'stars-status player2';
    el.textContent = 'Your turn — Select';
    document.body.appendChild(el);
    expect(
      documentSettleThinkingCleared(
        document,
        SETTLE_THINKING_SELECTOR,
        COMPUTER_OR_THINKING_RE.source
      )
    ).toBe(true);
  });

  it('empty status + no chrome → not thinking (fab/kwatro soft timeout path)', () => {
    const el = document.createElement('div');
    el.className = 'fab-status player1';
    el.textContent = '';
    document.body.appendChild(el);
    const snap = sampleSettleThinkingFromRoot(document);
    expect(sampleShowsSettleThinking(snap)).toBe(false);
    expect(
      documentHasSettleThinkingSignal(
        document,
        SETTLE_THINKING_SELECTOR,
        COMPUTER_OR_THINKING_RE.source
      )
    ).toBe(false);
  });

  it('tip-real thinking classes still win without status text', () => {
    const chrome = document.createElement('div');
    chrome.className = 'status-ai-thinking';
    document.body.appendChild(chrome);
    expect(
      documentHasSettleThinkingSignal(
        document,
        SETTLE_THINKING_SELECTOR,
        COMPUTER_OR_THINKING_RE.source
      )
    ).toBe(true);
  });
});

describe('console-sweep harness wiring (q-mp-1492)', () => {
  it('drops attribute-suffix status scan; uses shared class-token helper', () => {
    const src = readFileSync(HARNESS, 'utf8');
    expect(src).toMatch(/from ['"]\.\/lib\/console-sweep-settle\.mjs['"]/);
    expect(src).toMatch(/documentHasSettleThinkingSignal/);
    expect(src).toMatch(/documentSettleThinkingCleared/);
    expect(src).toMatch(/SETTLE_THINKING_SELECTOR/);
    // Must not reintroduce attribute-suffix miss for multi-class status.
    expect(src).not.toMatch(/class\$="-status"/);
    expect(src).not.toMatch(/\[class\$="-status"\]/);
  });

  it('lib exports class-token collectors + serializable browser helpers', () => {
    const libSrc = readFileSync(LIB, 'utf8');
    expect(libSrc).toMatch(/export function collectGameStatusNodes/);
    expect(libSrc).toMatch(/export function documentHasSettleThinkingSignal/);
    expect(libSrc).toMatch(/export function browserSampleSettleThinking/);
    expect(STATUS_ATTR_SUFFIX_SELECTOR).toBe('[class$="-status"]');
  });
});
