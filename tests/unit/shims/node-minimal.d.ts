/**
 * Minimal `node:` ambient typings for helper-test ratchet surface.
 * Avoids adding `@types/node` (would widen the whole project).
 * Type-only; not emitted.
 */

declare module 'node:path' {
  export function resolve(...paths: string[]): string;
  export function dirname(p: string): string;
  export function join(...paths: string[]): string;
  export function relative(from: string, to: string): string;
  export const sep: string;
  export const posix: { extname(p: string): string };
}

declare module 'node:url' {
  export function fileURLToPath(url: string | URL): string;
}

declare module 'node:fs' {
  export function mkdtempSync(prefix: string): string;
  export function writeFileSync(
    file: string,
    data: string,
    options?: string | { encoding?: string }
  ): void;
  export function rmSync(
    path: string,
    options?: { recursive?: boolean; force?: boolean }
  ): void;
}

declare module 'node:os' {
  export function tmpdir(): string;
}
