/**
 * Hermetic coverage for stars-bars deep harness honesty:
 *   q-mp-1486 Red win banners classify as `ai-win` (not /computer/i)
 *   q-mp-1490 thinking metric uses tip-real status text (no dead chrome class)
 * No Playwright launch. Stays on unit-shared (jsdom) so vitest.config
 * nodePureFiles need not change for this harness-only ticket.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  AI_THINKING_STATUS_RE,
  AI_WIN_STATUS_RE,
  classifyStarsBarsHvAOutcome,
  statusShowsAiThinking,
} from '../../scripts/lib/stars-bars-deep-outcome.mjs';
import { sampleShowsAiThinking } from '../../scripts/lib/stars-bars-new-game-race.mjs';

const HARNESS = resolve(process.cwd(), 'scripts/stars-bars-deep-playtest.mjs');
const LIB = resolve(process.cwd(), 'scripts/lib/stars-bars-deep-outcome.mjs');

function readHarness(): string {
  return readFileSync(HARNESS, 'utf8');
}

describe('q-mp-1486 classifyStarsBarsHvAOutcome — Red → ai-win', () => {
  it('classifies live Red / Blue / draw banners with stubbed status strings', () => {
    // Measured baseline: getPlayerName → Blue/Red; old /computer/i → human-win.
    expect(classifyStarsBarsHvAOutcome('🔴 Red wins with 18 points!')).toBe(
      'ai-win'
    );
    expect(classifyStarsBarsHvAOutcome('🔵 Blue wins with 22 points!')).toBe(
      'human-win'
    );
    expect(classifyStarsBarsHvAOutcome("It's a tie!")).toBe('draw');
    expect(classifyStarsBarsHvAOutcome("It's a Tie! 🤝")).toBe('draw');
    expect(classifyStarsBarsHvAOutcome('Draw!')).toBe('draw');
    expect(classifyStarsBarsHvAOutcome('Red Wins!')).toBe('ai-win');
    expect(classifyStarsBarsHvAOutcome('Blue Wins!')).toBe('human-win');
  });

  it('does not treat mid-game Computer thinking as ai-win', () => {
    // Classifier is only called after isEnded; still must not match /computer/.
    expect(AI_WIN_STATUS_RE.test('Computer is thinking…')).toBe(false);
    expect(classifyStarsBarsHvAOutcome('Computer is thinking…')).toBe(
      'human-win'
    );
  });

  it('harness wires classifyStarsBarsHvAOutcome and drops /computer/i outcome arms', () => {
    const src = readHarness();
    expect(src).toMatch(/from ['"]\.\/lib\/stars-bars-deep-outcome\.mjs['"]/);
    expect(src).toMatch(/classifyStarsBarsHvAOutcome/);
    // Outcome arms must not reintroduce /computer/i (par-55 uses /red/i).
    expect(src).not.toMatch(/\/computer\/i\.test\(/);
    const libSrc = readFileSync(LIB, 'utf8');
    expect(libSrc).toMatch(/AI_WIN_STATUS_RE\s*=\s*\/red\/i/);
  });
});

describe('q-mp-1490 thinking metric — tip-real status text, not dead class', () => {
  it('statusShowsAiThinking matches live Computer is thinking copy', () => {
    expect(statusShowsAiThinking('🔴 Computer is thinking…')).toBe(true);
    expect(statusShowsAiThinking('Computer is thinking...')).toBe(true);
    expect(statusShowsAiThinking("🔵 Blue's turn - Select a card")).toBe(false);
    expect(statusShowsAiThinking('')).toBe(false);
    expect(statusShowsAiThinking(null)).toBe(false);
    expect(AI_THINKING_STATUS_RE.test('Computer is thinking…')).toBe(true);
  });

  it('race sample helper still sees thinking from status alone', () => {
    expect(
      sampleShowsAiThinking({
        status: 'Computer is thinking…',
      })
    ).toBe(true);
    expect(
      sampleShowsAiThinking({
        thinking: false,
        status: "Blue's turn - Select a card",
      })
    ).toBe(false);
  });

  it('harness drops live .status-ai-thinking selectors', () => {
    const src = readHarness();
    expect(src).toMatch(/statusShowsAiThinking/);
    expect(src).toMatch(/\/computer is thinking\/i/);
    // Dead product-chrome class must not drive measure / wait / race sample.
    expect(src).not.toMatch(/querySelector\(\s*['"]\.status-ai-thinking['"]/);
    expect(src).not.toMatch(/\.locator\(\s*['"]\.status-ai-thinking['"]/);
    // Comment-only mentions of the dead class are OK; live calls are not.
    expect(src).toMatch(/q-mp-1490/);
  });
});
