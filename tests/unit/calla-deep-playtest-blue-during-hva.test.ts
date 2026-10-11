/**
 * q-mp-1459: blueDuringHva must latch mid-game Blue-turn status, not only
 * the end banner. Pure latch + harness wiring (unit-shared; no Playwright).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  BLUE_TURN_STATUS_RE,
  blueDuringHvaFromStatuses,
  isBlueTurnStatus,
  latchBlueDuringHva,
} from '../../scripts/lib/calla-blue-during-hva.mjs';
import { isCallaEndStatus } from '../../scripts/lib/calla-end-status.mjs';

const HARNESS = resolve(process.cwd(), 'scripts/calla-deep-playtest.mjs');
const LIB = resolve(process.cwd(), 'scripts/lib/calla-blue-during-hva.mjs');

describe('isBlueTurnStatus / latchBlueDuringHva (q-mp-1459)', () => {
  it('matches mid-game Blue turn copy and rejects end banners', () => {
    expect(isBlueTurnStatus("Blue's turn - Select a shield")).toBe(true);
    expect(isBlueTurnStatus("Blue's turn — sow cubes")).toBe(true);
    expect(isBlueTurnStatus('You Wins!')).toBe(false);
    expect(isBlueTurnStatus('AI Wins!')).toBe(false);
    expect(isBlueTurnStatus("It's a Tie!")).toBe(false);
    expect(isBlueTurnStatus('🤖 AI is thinking...')).toBe(false);
    expect(isBlueTurnStatus('')).toBe(false);
    expect(isBlueTurnStatus(null)).toBe(false);
  });

  it('sticky-ORs across a stubbed play-loop status sequence', () => {
    // Realistic finish: mid-game Blue turn then end banner "You Wins!".
    expect(
      blueDuringHvaFromStatuses([
        "Blue's turn - Select a shield",
        '🤖 AI is thinking...',
        'You Wins!',
      ])
    ).toBe(true);

    // End-only sampling would see only the banner → false (the bug).
    expect(blueDuringHvaFromStatuses(['You Wins!'])).toBe(false);
    expect(
      blueDuringHvaFromStatuses(['🤖 AI is thinking...', 'AI Wins!'])
    ).toBe(false);

    // Latch stays true once set.
    expect(latchBlueDuringHva(true, 'You Wins!')).toBe(true);
    expect(latchBlueDuringHva(false, "Blue's turn")).toBe(true);
    expect(latchBlueDuringHva(false, 'You Wins!')).toBe(false);
  });

  it('leaves end-only grammar / isCallaEndStatus semantics unchanged', () => {
    expect(isCallaEndStatus('You Wins!')).toBe(true);
    expect(isCallaEndStatus("Blue's turn - Select a shield")).toBe(false);
    expect(BLUE_TURN_STATUS_RE.test('You Wins!')).toBe(false);
  });
});

describe('calla-deep-playtest harness wiring (q-mp-1459)', () => {
  it('imports latchBlueDuringHva and does not sample Blue turn only at end', () => {
    const src = readFileSync(HARNESS, 'utf8');
    expect(src).toMatch(/from ['"]\.\/lib\/calla-blue-during-hva\.mjs['"]/);
    expect(src).toMatch(/latchBlueDuringHva/);
    // Must not reintroduce end-only assembly sampling.
    expect(src).not.toMatch(
      /blueDuringHva:\s*\/Blue's turn\/i\.test\(await statusText\(page\)\)/
    );
    // End-only grammar flag stays end-only.
    expect(src).toMatch(
      /youWinsGrammar:\s*\/You Wins\/i\.test\(winner\s*\|\|\s*['"]['"]\)/
    );
  });

  it('keeps the pure latch helper in scripts/lib', () => {
    const libSrc = readFileSync(LIB, 'utf8');
    expect(libSrc).toMatch(/export function latchBlueDuringHva/);
    expect(libSrc).toMatch(/export function blueDuringHvaFromStatuses/);
    expect(libSrc).toMatch(/Blue's turn/);
  });
});
