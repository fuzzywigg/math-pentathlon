/**
 * Combined app CSS (menu shell + lazy play styles) for style-handshake tests.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export function readAppCss(): string {
  const root = process.cwd();
  return (
    readFileSync(resolve(root, 'src/style.css'), 'utf8') +
    '\n' +
    readFileSync(resolve(root, 'src/ui/styles/game-play.css'), 'utf8')
  );
}
