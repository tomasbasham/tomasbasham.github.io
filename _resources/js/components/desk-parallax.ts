import type { AlpineComponent } from 'alpinejs';

import { ease, isSettled, pointerToOffset, tiltToOffset } from '@/utils/parallax';
import type { Offset, Tilt } from '@/utils/parallax';

// Fraction of the remaining distance covered each frame. Small enough to feel
// like drift rather than a snap.
const EASING = 0.08;

// How quickly the tilt baseline follows the device, so that a phone held still
// in a new pose drifts back to rest instead of staying offset.
const BASELINE_DRIFT = 0.02;

// iOS gates device orientation behind a permission prompt that may only be
// raised from a user gesture.
type OrientationEventWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

interface DeskParallaxProps {
  current: Offset;
  target: Offset;
  baseline: Tilt | null;
  frame: number;
  visible: boolean;
  active: boolean;
  observer: IntersectionObserver | null;
  teardown: Array<() => void>;
  start: () => void;
  stop: () => void;
  listenToPointer: () => void;
  listenToTilt: () => void;
  schedule: () => void;
  tick: () => void;
}

type DeskParallaxComponent = AlpineComponent<DeskParallaxProps>;

/**
 * Moves the desk's layers a little as the pointer moves (hover-capable
 * devices) or as the device tilts (touch devices). It only writes two numbers,
 * --px and --py, to the element; desk-header.css decides how far each layer
 * travels.
 *
 * Nothing runs for visitors who prefer reduced motion, and the animation loop
 * sleeps whenever the scene is off screen, the tab is hidden or the layers
 * have come to rest.
 */
export default (): DeskParallaxComponent => ({
  current: { x: 0, y: 0 },
  target: { x: 0, y: 0 },
  baseline: null,
  frame: 0,
  visible: true,
  active: false,
  observer: null,
  teardown: [],

  init() {
    if (typeof window.matchMedia !== 'function') {
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onPreferenceChange = (): void => (reduced.matches ? this.stop() : this.start());

    reduced.addEventListener('change', onPreferenceChange);
    this.teardown.push(() => reduced.removeEventListener('change', onPreferenceChange));

    if (!reduced.matches) {
      this.start();
    }
  },

  destroy() {
    this.stop();
    this.teardown.forEach(undo => undo());
    this.teardown = [];
  },

  start() {
    if (this.active) {
      return;
    }

    this.active = true;

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      this.listenToPointer();
    } else {
      this.listenToTilt();
    }

    if (typeof IntersectionObserver === 'function') {
      this.observer = new IntersectionObserver(([entry]) => {
        this.visible = entry?.isIntersecting ?? true;
        this.schedule();
      });
      this.observer.observe(this.$el);
    }

    const onVisibility = (): void => this.schedule();
    document.addEventListener('visibilitychange', onVisibility);
    this.teardown.push(() => document.removeEventListener('visibilitychange', onVisibility));
  },

  stop() {
    this.active = false;
    this.$el.style.removeProperty('--px');
    this.$el.style.removeProperty('--py');

    this.observer?.disconnect();
    this.observer = null;

    if (this.frame) {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
    }

    this.teardown.forEach(undo => undo());
    this.teardown = [];
    this.current = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.baseline = null;
  },

  listenToPointer() {
    const onMove = (event: PointerEvent): void => {
      this.target = pointerToOffset(event.clientX, event.clientY, window.innerWidth, window.innerHeight);
      this.schedule();
    };
    const onLeave = (): void => {
      this.target = { x: 0, y: 0 };
      this.schedule();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    this.teardown.push(() => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    });
  },

  listenToTilt() {
    if (typeof DeviceOrientationEvent === 'undefined') {
      return;
    }

    const onTilt = (event: DeviceOrientationEvent): void => {
      if (event.gamma === null || event.beta === null) {
        return;
      }

      const reading: Tilt = { gamma: event.gamma, beta: event.beta };
      this.baseline ??= { ...reading };
      this.target = tiltToOffset(reading, this.baseline, window.screen?.orientation?.angle ?? 0);

      this.baseline = {
        gamma: ease(this.baseline.gamma, reading.gamma, BASELINE_DRIFT),
        beta: ease(this.baseline.beta, reading.beta, BASELINE_DRIFT),
      };
      this.schedule();
    };

    const attach = (): void => {
      window.addEventListener('deviceorientation', onTilt, { passive: true });
      this.teardown.push(() => window.removeEventListener('deviceorientation', onTilt));
    };

    const { requestPermission } = DeviceOrientationEvent as OrientationEventWithPermission;
    if (typeof requestPermission !== 'function') {
      attach();
      return;
    }

    // iOS: ask on the first tap. If the visitor declines the scene stays still.
    const onTap = (): void => {
      requestPermission.call(DeviceOrientationEvent)
        .then(state => (state === 'granted' && this.active ? attach() : undefined))
        .catch(() => undefined);
    };

    document.addEventListener('click', onTap, { once: true });
    this.teardown.push(() => document.removeEventListener('click', onTap));
  },

  schedule() {
    if (this.frame || !this.active || !this.visible || document.hidden) {
      return;
    }

    this.frame = requestAnimationFrame(() => this.tick());
  },

  tick() {
    this.frame = 0;

    this.current = {
      x: ease(this.current.x, this.target.x, EASING),
      y: ease(this.current.y, this.target.y, EASING),
    };

    this.$el.style.setProperty('--px', this.current.x.toFixed(4));
    this.$el.style.setProperty('--py', this.current.y.toFixed(4));

    if (!isSettled(this.current, this.target)) {
      this.schedule();
    }
  },
});
