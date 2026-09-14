/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Handshake contig×sum×remainder exports. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { injectContigStyles, renderBoard as renderContig } from '../../src/games/contig-60/board-ui';
import { injectSDStyles, renderBoard as renderSum } from '../../src/games/sum-dominoes/board-ui';
import {
  injectRemainderIslandsStyles,
  renderBoard as renderRemainder,
} from '../../src/games/remainder-islands/board-ui';
import { createInitialState as contigInit } from '../../src/games/contig-60/types';
import { createInitialState as sumInit } from '../../src/games/sum-dominoes/rules';
import { createInitialState as remInit } from '../../src/games/remainder-islands/types';

describe('Wave 56 handshake — contig × sum × remainder', () => {
  it('exports inject + opening render shells leftover', () => {
    expect(typeof injectContigStyles).toBe('function');
    expect(typeof injectSDStyles).toBe('function');
    expect(typeof injectRemainderIslandsStyles).toBe('function');
    expect(renderContig(contigInit(), () => undefined).classList.contains('contig-board')).toBe(true);
    expect(renderSum(sumInit(), () => undefined).classList.contains('sd-board')).toBe(true);
    expect(renderRemainder(remInit(), () => undefined).tagName.toLowerCase()).toBe('svg');
  });
});
