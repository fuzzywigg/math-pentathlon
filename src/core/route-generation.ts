/**
 * Guards async route mounts against stale completions when the player
 * navigates away before a dynamic import finishes.
 */
let generation = 0;

export function nextRouteGeneration(): number {
  generation += 1;
  return generation;
}

export function isCurrentRouteGeneration(gen: number): boolean {
  return gen === generation;
}

/** Current route-generation token (for stale-shell clobber recovery). */
export function getRouteGeneration(): number {
  return generation;
}
