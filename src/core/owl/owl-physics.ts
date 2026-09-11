/**
 * Thin Ollie overlay coast helpers — integrate + clamp only (no bounce).
 */

export const OWL_FRICTION = 0.92;
export const OWL_REST_SPEED = 0.4;

export interface OwlPhysicsState {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/** One frame of damped free motion. */
export function integrate(
  state: OwlPhysicsState,
  friction: number = OWL_FRICTION
): OwlPhysicsState {
  return {
    x: state.x + state.vx,
    y: state.y + state.vy,
    vx: state.vx * friction,
    vy: state.vy * friction,
  };
}

/** Keep top-left within the viewport for a box of the given size. */
export function clampToViewport(
  x: number,
  y: number,
  width: number,
  height: number,
  viewportWidth: number,
  viewportHeight: number
): { x: number; y: number } {
  const maxX = Math.max(0, viewportWidth - width);
  const maxY = Math.max(0, viewportHeight - height);
  return {
    x: Math.min(Math.max(0, x), maxX),
    y: Math.min(Math.max(0, y), maxY),
  };
}

export function isAtRest(vx: number, vy: number, threshold: number = OWL_REST_SPEED): boolean {
  return Math.hypot(vx, vy) < threshold;
}
