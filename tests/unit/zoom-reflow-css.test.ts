/**
 * Guards for WCAG zoom/reflow CSS (burn-1008-mp-zoom-reflow).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('zoom-reflow CSS keepers', () => {
  const css = readFileSync(
    resolve(process.cwd(), 'src/ui/styles/zoom-reflow.css'),
    'utf8'
  );
  const main = readFileSync(resolve(process.cwd(), 'src/main.ts'), 'utf8');

  it('is imported from main.ts (always-on shell CSS)', () => {
    expect(main).toMatch(/ui\/styles\/zoom-reflow\.css/);
  });

  it('removes the hard body min-width floor for 320 CSS px reflow', () => {
    expect(css).toMatch(/body\s*\{[^}]*min-width:\s*0/s);
  });

  it('uses progressive minmax so game-grid tracks can shrink below 300px', () => {
    expect(css).toMatch(/minmax\(\s*min\(\s*100%\s*,\s*300px\s*\)/);
  });

  it('opens accordion panels with a generous max-height to avoid card clip', () => {
    expect(css).toMatch(
      /\.accordion-open\s*>\s*\.accordion-panel\s*\{[^}]*max-height:\s*5000px\s*!important/s
    );
  });

  it('keeps modal content inside the viewport width', () => {
    expect(css).toMatch(/\.modal-content\s*\{[^}]*100vw/s);
  });
});
