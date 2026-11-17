import DeskParallaxComponent from '@/components/desk-parallax';

type Component = ReturnType<typeof DeskParallaxComponent> & { $el: HTMLElement };

const mockMedia = (matches: Record<string, boolean>): void => {
  window.matchMedia = vi.fn((query: string) => ({
    matches: matches[query] ?? false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
};

const created: Component[] = [];

const create = (): Component => {
  const component = DeskParallaxComponent() as Component;
  component.$el = document.createElement('div');
  created.push(component);
  return component;
};

// Runs queued animation frames until none are left.
let queue: FrameRequestCallback[] = [];
const flush = (): void => {
  for (let i = 0; i < 600 && queue.length; i++) {
    const run = queue;
    queue = [];
    run.forEach(callback => callback(0));
  }
};

beforeEach(() => {
  queue = [];
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => queue.push(callback));
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {
    queue = [];
  });
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1000 });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
});

afterEach(() => {
  // Components listen on window, so each must be torn down or it leaks into the next test.
  created.splice(0).forEach(component => component.destroy?.());
  vi.restoreAllMocks();
});

describe('deskParallax', () => {
  it('does nothing without matchMedia', () => {
    // @ts-expect-error: simulating an environment without matchMedia
    delete window.matchMedia;
    const component = create();

    expect(() => component.init?.()).not.toThrow();
    window.dispatchEvent(new Event('pointermove'));
    expect(queue).toHaveLength(0);
  });

  it('does nothing when the visitor prefers reduced motion', () => {
    mockMedia({ '(prefers-reduced-motion: reduce)': true, '(hover: hover) and (pointer: fine)': true });
    const component = create();
    component.init?.();

    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 900, clientY: 700 }));
    flush();

    expect(component.$el.style.getPropertyValue('--px')).toBe('');
  });

  it('eases the offsets towards the pointer position, then sleeps', () => {
    mockMedia({ '(hover: hover) and (pointer: fine)': true });
    const component = create();
    component.init?.();

    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 1000, clientY: 400 }));
    flush();

    expect(Number(component.$el.style.getPropertyValue('--px'))).toBeCloseTo(1, 2);
    expect(Number(component.$el.style.getPropertyValue('--py'))).toBeCloseTo(0, 2);
    expect(queue).toHaveLength(0);
  });

  it('does not jump: the first frame covers only part of the distance', () => {
    mockMedia({ '(hover: hover) and (pointer: fine)': true });
    const component = create();
    component.init?.();

    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 1000, clientY: 400 }));
    queue.shift()?.(0);

    const px = Number(component.$el.style.getPropertyValue('--px'));
    expect(px).toBeGreaterThan(0);
    expect(px).toBeLessThan(0.2);
  });

  it('returns to rest when the pointer leaves the window', () => {
    mockMedia({ '(hover: hover) and (pointer: fine)': true });
    const component = create();
    component.init?.();

    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 1000, clientY: 400 }));
    flush();
    document.documentElement.dispatchEvent(new Event('pointerleave'));
    flush();

    expect(Number(component.$el.style.getPropertyValue('--px'))).toBeCloseTo(0, 2);
  });

  it('follows device tilt on touch devices, relative to the first reading', () => {
    mockMedia({});
    (window as unknown as { DeviceOrientationEvent: unknown }).DeviceOrientationEvent = class {};
    const component = create();
    component.init?.();

    const tilt = (gamma: number, beta: number): void => {
      const event = new Event('deviceorientation') as Event & { gamma: number; beta: number };
      event.gamma = gamma;
      event.beta = beta;
      window.dispatchEvent(event);
    };

    tilt(5, 40); // sets the baseline
    tilt(25, 40);
    flush();

    expect(Number(component.$el.style.getPropertyValue('--px'))).toBeGreaterThan(0.5);
  });

  it('stays still on iOS until the visitor taps and grants permission', async () => {
    mockMedia({});
    const requestPermission = vi.fn().mockResolvedValue('granted');
    (window as unknown as { DeviceOrientationEvent: unknown }).DeviceOrientationEvent = class {
      static requestPermission = requestPermission;
    };
    const component = create();
    component.init?.();

    expect(requestPermission).not.toHaveBeenCalled();
    document.dispatchEvent(new Event('click'));
    await Promise.resolve();
    await Promise.resolve();

    expect(requestPermission).toHaveBeenCalledTimes(1);
  });

  it('clears its properties and listeners when destroyed', () => {
    mockMedia({ '(hover: hover) and (pointer: fine)': true });
    const component = create();
    component.init?.();
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 1000, clientY: 400 }));
    flush();

    component.destroy?.();
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 0, clientY: 0 }));

    expect(component.$el.style.getPropertyValue('--px')).toBe('');
    expect(queue).toHaveLength(0);
  });
});
