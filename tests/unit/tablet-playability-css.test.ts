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
const gamePlayCss = readFileSync(
  resolve(__dirname, '../../src/ui/styles/game-play.css'),
  'utf8'
);

describe('tablet / offline playability CSS', () => {
  it('uses hover:none or pointer:coarse for 44px touch targets', () => {
    expect(styleCss).toMatch(
      /@media\s*\(hover:\s*none\)\s*,\s*\(pointer:\s*coarse\)/
    );
    expect(styleCss).toMatch(/min-height:\s*44px/);
    expect(styleCss).toMatch(/\.difficulty-btn\s*\{[^}]*min-width:\s*44px/s);
    expect(styleCss).toMatch(
      /\.owl-bubble-dismiss,\s*\n\s*\.owl-minimize-btn\s*\{[^}]*min-height:\s*44px/s
    );
    expect(styleCss).toMatch(/\.hero-progress-link\s*\{[^}]*min-height:\s*44px/s);
  });

  it('keeps Ollie minimize visible on touch (no hover-only reveal)', () => {
    expect(styleCss).toMatch(
      /@media\s*\(hover:\s*none\)\s*,\s*\(pointer:\s*coarse\)[\s\S]*?\.owl-minimize-btn\s*\{[^}]*opacity:\s*1/s
    );
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
    expect(mobileCss).toContain('safe-area-inset-top');
    expect(mobileCss).toContain('safe-area-inset-left');
    expect(mobileCss).toContain('safe-area-inset-bottom');
  });

  it('pairs 100vh fallbacks with 100dvh for dynamic viewport engines', () => {
    expect(styleCss).toMatch(/min-height:\s*100vh/);
    expect(styleCss).toMatch(/min-height:\s*100dvh/);
    expect(mobileCss).toMatch(/100vh\s*-\s*35rem/);
    expect(mobileCss).toMatch(/100dvh\s*-\s*35rem/);
  });

  it('keeps move-history collapse toggle ≥44px on phone layouts', () => {
    // Lazy game-play.css used to set min-height:auto under max-width:560px,
    // which overrode the coarse 44px floor from style.css.
    expect(gamePlayCss).toMatch(
      /@media\s*\(max-width:\s*560px\)[\s\S]*?\.collapse-toggle\s*\{[^}]*min-height:\s*44px/s
    );
    expect(gamePlayCss).toMatch(
      /\.collapse-toggle\s*\{[^}]*touch-action:\s*manipulation/s
    );
    expect(styleCss).toMatch(/\.back-button\s*\{[^}]*touch-action:\s*manipulation/s);
    expect(gamePlayCss).toMatch(
      /\.modal-close\s*\{[^}]*touch-action:\s*manipulation/s
    );
  });

  it('applies board pointer hygiene touch-action on #board surfaces', () => {
    expect(gamePlayCss).toMatch(
      /#board\s*,[\s\S]*#game-container[\s\S]*touch-action:\s*manipulation/
    );
    expect(gamePlayCss).toMatch(/-webkit-touch-callout:\s*none/);
  });
});
