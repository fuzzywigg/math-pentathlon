/**
 * TOKENMAXX ON-20260926 — engines.node CI honesty (distinct from #346 envjson / #347 unit timeout).
 * Assert package.json engines.node exists and matches workflow setup-node pins.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('ON-20260926 — engines.node CI honesty', () => {
  it('package.json engines.node is >=20 and workflows pin node-version 20', () => {
    const pkg = JSON.parse(
      readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')
    ) as { engines?: { node?: string } };
    const ci = readFileSync(
      resolve(process.cwd(), '.github/workflows/ci.yml'),
      'utf8'
    );
    const deploy = readFileSync(
      resolve(process.cwd(), '.github/workflows/deploy.yml'),
      'utf8'
    );

    expect(pkg.engines?.node).toBe('>=20');

    const ciPins = [...ci.matchAll(/node-version:\s*['"]?(\d+)/g)].map(
      (m) => m[1]
    );
    const deployPins = [...deploy.matchAll(/node-version:\s*['"]?(\d+)/g)].map(
      (m) => m[1]
    );

    expect(ciPins.length).toBeGreaterThan(0);
    expect(deployPins.length).toBeGreaterThan(0);
    expect(ciPins.every((v) => v === '20')).toBe(true);
    expect(deployPins.every((v) => v === '20')).toBe(true);
  });
});
