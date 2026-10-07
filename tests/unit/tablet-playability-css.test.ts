/**
 * Handshake: touch-target + reduced-motion + offline chrome stay in CSS.
 * Guards regressions without loading the full Vite bundle.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readAppCss } from './_app-css';

const styleCss = readAppCss();
const mobileCss = readFileSync(
  resolve(__dirname, '../../src/ui/styles/mobile-play-shell.css'),
  'utf8'
);

describe('tablet / offline playability CSS', () => {
  it('uses hover:none or pointer:coarse for 44px touch targets', () => {
    expect(styleCss).toMatch(
      /@media\s*\(hover:\s*none\)\s*,\s*\(pointer:\s*coarse\)/
    );
    expect(styleCss).toMatch(/min-height:\s*44px/);
    expect(styleCss).toMatch(/\.difficulty-btn\s*\{[^}]*min-width:\s*44px/s);
  });

  it('mirrors reduced-motion onto html[data-reduced-motion]', () => {
    expect(styleCss).toContain("html[data-reduced-motion='true']");
    expect(styleCss).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(styleCss).toMatch(
      /html\[data-reduced-motion='true'\][^{]*\{[^}]*--transition-fast:\s*0\.01ms/s
    );
  });

  it('shows an offline banner via html[data-offline]', () => {
    expect(styleCss).toContain("html[data-offline='true'] body::before");
  });

  it('applies safe-area insets on the mobile play shell', () => {
    expect(mobileCss).toContain('safe-area-inset-left');
    expect(mobileCss).toContain('safe-area-inset-bottom');
  });
});
