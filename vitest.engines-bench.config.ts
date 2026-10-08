/**
 * Dedicated Vitest config for report-only rules-engine microbenchmarks.
 * Not wired into CI / npm run test:unit — invoke via `npm run bench:engines`.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const pwaRegisterAlias = {
  'virtual:pwa-register': path.join(
    rootDir,
    'tests/unit/mocks/virtual-pwa-register.ts'
  ),
};

export default defineConfig({
  resolve: { alias: pwaRegisterAlias },
  test: {
    name: 'engines-bench',
    globals: true,
    environment: 'node',
    setupFiles: ['tests/unit/setup-node.ts'],
    pool: 'forks',
    isolate: true,
    fileParallelism: false,
    testTimeout: 300_000,
    hookTimeout: 60_000,
    include: ['tests/bench/engines-rules.bench.ts'],
  },
});
