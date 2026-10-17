/**
 * q-mp-1493: nav-away mid-AI sample must find multi-class status + tip-real
 * thinking chrome (at least `.sd-computer-thinking`). Hermetic jsdom stubs +
 * harness wiring — no Playwright / product edits.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  STATUS_ATTR_SUFFIX_SELECTOR,
  SETTLE_THINKING_SELECTOR,
  browserSampleSettleThinking,
  sampleSettleThinkingFromRoot,
  sampleShowsSettleThinking,
} from '../../scripts/lib/console-sweep-settle.mjs';
import {
  AI_THINK_POLL_MS,
  sampleShowsAiThinking,
  waitForAiThinkingChromeFromSequence,
} from '../../scripts/lib/stars-bars-new-game-race.mjs';

const HARNESS = resolve(process.cwd(), 'scripts/nav-away-sweep.mjs');

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('nav-away multi-class + sd chrome sample (q-mp-1493)', () => {
  it('stars-bars multi-class status text arms mid-AI sample', () => {
    const el = document.createElement('div');
    el.className = 'stars-status player2';
    el.textContent = 'Computer is thinking…';
    document.body.appendChild(el);

    expect(document.querySelector(STATUS_ATTR_SUFFIX_SELECTOR)).toBeNull();
    expect(document.querySelector('.status-ai-thinking')).toBeNull();

    const snap = sampleSettleThinkingFromRoot(document, {
      thinkingSelector: SETTLE_THINKING_SELECTOR,
    });
    expect(snap.thinking).toBe(false);
    expect(snap.status).toBe('Computer is thinking…');
    expect(sampleShowsAiThinking(snap)).toBe(true);
    expect(sampleShowsSettleThinking(snap)).toBe(true);

    // Browser-serializable twin must agree (harness ships .toString()).
    const browserSnap = browserSampleSettleThinking(document, {
      thinkingSelector: SETTLE_THINKING_SELECTOR,
    });
    expect(browserSnap).toEqual(snap);
  });

  it('sum-dominoes .sd-computer-thinking arms without status-ai-thinking', () => {
    const chrome = document.createElement('div');
    chrome.className = 'sd-computer-thinking';
    document.body.appendChild(chrome);
    const status = document.createElement('div');
    status.className = 'sd-status';
    status.textContent = 'Computer is thinking…';
    document.body.appendChild(status);

    expect(document.querySelector('.status-ai-thinking')).toBeNull();
    const snap = sampleSettleThinkingFromRoot(document);
    expect(snap.thinking).toBe(true);
    expect(SETTLE_THINKING_SELECTOR).toContain('.sd-computer-thinking');
    expect(sampleShowsAiThinking(snap)).toBe(true);
  });

  it('empty status + thinking:false → timeout short-circuit (no mid-AI arm)', async () => {
    const result = await waitForAiThinkingChromeFromSequence(
      [
        { thinking: false, status: '' },
        { thinking: false, status: '' },
      ],
      { deadlineMs: AI_THINK_POLL_MS * 2, pollMs: AI_THINK_POLL_MS }
    );
    expect(result).toEqual({ sawThinking: false, reason: 'timeout' });
  });

  it('stub sequence: multi-class status text seen after delay', async () => {
    const result = await waitForAiThinkingChromeFromSequence([
      { thinking: false, status: 'Your turn — Select' },
      {
        thinking: false,
        status: 'Computer is thinking…', // stars-status player2 text
      },
    ]);
    expect(result).toEqual({ sawThinking: true, reason: 'thinking' });
  });

  it('stub sequence: sd chrome flag without status-ai-thinking', async () => {
    const result = await waitForAiThinkingChromeFromSequence([
      { thinking: false, status: 'Your turn — Roll' },
      { thinking: true, status: 'Computer is thinking…' }, // .sd-computer-thinking
    ]);
    expect(result.sawThinking).toBe(true);
    expect(result.reason).toBe('thinking');
  });
});

describe('nav-away-sweep harness wiring (q-mp-1493)', () => {
  it('samples via shared settle helper; drops attribute-suffix + status-ai-only', () => {
    const src = readFileSync(HARNESS, 'utf8');
    expect(src).toMatch(/from ['"]\.\/lib\/console-sweep-settle\.mjs['"]/);
    expect(src).toMatch(/browserSampleSettleThinking/);
    expect(src).toMatch(/SETTLE_THINKING_SELECTOR/);
    expect(src).toMatch(/waitForAiThinkingChrome/);
    // Must not reintroduce attribute-suffix miss or status-ai-thinking-only locator.
    expect(src).not.toMatch(/class\$="-status"/);
    expect(src).not.toMatch(/\[class\$="-status"\]/);
    expect(src).not.toMatch(/\.locator\(\s*['"]\.status-ai-thinking['"]\s*\)/);
  });

  it('keeps tip-real chrome list including sd-computer-thinking', () => {
    expect(SETTLE_THINKING_SELECTOR).toContain('.status-ai-thinking');
    expect(SETTLE_THINKING_SELECTOR).toContain('.sd-computer-thinking');
    expect(SETTLE_THINKING_SELECTOR).toContain('.pg-computer-thinking');
  });
});
