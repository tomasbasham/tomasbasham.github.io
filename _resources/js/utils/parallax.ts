/**
 * Pure helpers for the desk parallax. Offsets are unitless numbers in the
 * range -1 to 1: the component writes them to CSS custom properties and the
 * stylesheet turns them into a distance per layer.
 */

export interface Offset {
  x: number;
  y: number;
}

export interface Tilt {
  gamma: number;
  beta: number;
}

/** Degrees of tilt, either side of the starting pose, that reach full offset. */
export const TILT_RANGE = 20;

export const clamp = (value: number, min = -1, max = 1): number =>
  Math.min(max, Math.max(min, value));

/** Moves `current` a fraction `factor` of the way to `target`. */
export const ease = (current: number, target: number, factor: number): number =>
  current + (target - current) * factor;

export const isSettled = (a: Offset, b: Offset, epsilon = 0.001): boolean =>
  Math.abs(a.x - b.x) < epsilon && Math.abs(a.y - b.y) < epsilon;

/** Where the pointer is within the window: the centre is 0, the edges are +-1. */
export const pointerToOffset = (clientX: number, clientY: number, width: number, height: number): Offset => {
  if (width <= 0 || height <= 0) {
    return { x: 0, y: 0 };
  }

  return {
    x: clamp((clientX / width) * 2 - 1),
    y: clamp((clientY / height) * 2 - 1),
  };
};

/**
 * How far the device has tipped from `base`, the pose it was held in when
 * tracking began. `gamma` is left-right tilt and `beta` is front-back tilt in
 * the device's own frame, so the axes swap when the screen is rotated:
 * `angle` is `screen.orientation.angle`.
 */
export const tiltToOffset = (current: Tilt, base: Tilt, angle = 0, range = TILT_RANGE): Offset => {
  const g = (current.gamma - base.gamma) / range;
  const b = (current.beta - base.beta) / range;

  switch (((angle % 360) + 360) % 360) {
    case 90:
      return { x: clamp(b), y: clamp(-g) };
    case 180:
      return { x: clamp(-g), y: clamp(-b) };
    case 270:
      return { x: clamp(-b), y: clamp(g) };
    default:
      return { x: clamp(g), y: clamp(b) };
  }
};
