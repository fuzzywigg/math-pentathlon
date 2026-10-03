/**
 * Dynamic import gate for the optional Three.js Hex-a-Gone board.
 * Lives in the game package so the ui/three chunk stays lazy until the flag is on.
 */
export function loadHexAGoneBoard3DModule(): Promise<
  typeof import('../../ui/three/hex-a-gone-board-3d')
> {
  return import('../../ui/three/hex-a-gone-board-3d');
}
