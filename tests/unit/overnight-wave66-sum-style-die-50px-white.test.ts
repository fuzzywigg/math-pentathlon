/**
 * Wave 66 leftover after tip/#316 — Sum die 50px white chrome.
 * Soft die-pip / shadow rgba existed; lock 50px white + #333 border. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 sum — style die 50px white', () => {
  it('pins sd-die 50px white + 2px #333 border leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-die\s*\{[\s\S]*?width:\s*50px/);
    expect(css).toMatch(/\.sd-die\s*\{[\s\S]*?height:\s*50px/);
    expect(css).toMatch(/\.sd-die\s*\{[\s\S]*?background:\s*white/);
    expect(css).toMatch(/\.sd-die\s*\{[\s\S]*?border:\s*2px solid #333/);
  });
});
