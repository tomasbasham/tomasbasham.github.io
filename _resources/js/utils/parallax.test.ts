import { clamp, ease, isSettled, pointerToOffset, tiltToOffset } from '@/utils/parallax';

describe('clamp', () => {
  it('holds a value within -1 and 1', () => {
    expect(clamp(3)).toBe(1);
    expect(clamp(-3)).toBe(-1);
    expect(clamp(0.25)).toBe(0.25);
  });
});

describe('ease', () => {
  it('moves a fraction of the way to the target', () => {
    expect(ease(0, 1, 0.25)).toBe(0.25);
    expect(ease(1, 0, 0.5)).toBe(0.5);
  });
});

describe('isSettled', () => {
  it('is true once both axes are within epsilon', () => {
    expect(isSettled({ x: 0.0004, y: 0 }, { x: 0, y: 0 })).toBe(true);
    expect(isSettled({ x: 0.01, y: 0 }, { x: 0, y: 0 })).toBe(false);
  });
});

describe('pointerToOffset', () => {
  it('is 0 at the centre and +-1 at the edges', () => {
    expect(pointerToOffset(500, 400, 1000, 800)).toEqual({ x: 0, y: 0 });
    expect(pointerToOffset(0, 0, 1000, 800)).toEqual({ x: -1, y: -1 });
    expect(pointerToOffset(1000, 800, 1000, 800)).toEqual({ x: 1, y: 1 });
  });

  it('stays within range if the pointer is reported outside the window', () => {
    expect(pointerToOffset(-50, 2000, 1000, 800)).toEqual({ x: -1, y: 1 });
  });

  it('is 0 when the window has no size', () => {
    expect(pointerToOffset(10, 10, 0, 0)).toEqual({ x: 0, y: 0 });
  });
});

describe('tiltToOffset', () => {
  const base = { gamma: 0, beta: 40 };

  it('is 0 at the starting pose', () => {
    expect(tiltToOffset({ gamma: 0, beta: 40 }, base)).toEqual({ x: 0, y: 0 });
  });

  it('reaches +-1 at the tilt range and no further', () => {
    expect(tiltToOffset({ gamma: 20, beta: 60 }, base)).toEqual({ x: 1, y: 1 });
    expect(tiltToOffset({ gamma: -90, beta: -90 }, base)).toEqual({ x: -1, y: -1 });
  });

  it('swaps axes when the screen is rotated', () => {
    expect(tiltToOffset({ gamma: 10, beta: 40 }, base, 90)).toEqual({ x: 0, y: -0.5 });
    expect(tiltToOffset({ gamma: 10, beta: 40 }, base, 270)).toEqual({ x: -0, y: 0.5 });
    expect(tiltToOffset({ gamma: 10, beta: 50 }, base, 180)).toEqual({ x: -0.5, y: -0.5 });
  });

  it('treats a negative angle as its positive equivalent', () => {
    expect(tiltToOffset({ gamma: 10, beta: 40 }, base, -90)).toEqual(tiltToOffset({ gamma: 10, beta: 40 }, base, 270));
  });
});
