import SiteNavComponent from '@/components/site-nav';

type Component = ReturnType<typeof SiteNavComponent> & { $el: HTMLElement };

type Observe = (entries: Array<Partial<IntersectionObserverEntry>>) => void;

let callback: Observe;
let options: IntersectionObserverInit | undefined;
const disconnect = vi.fn();

const create = (): Component => {
  const bar = document.createElement('header');
  bar.className = 'navbar navbar-overlay';
  Object.defineProperty(bar, 'offsetHeight', { configurable: true, value: 52 });

  const component = SiteNavComponent() as Component;
  component.$el = bar;
  return component;
};

beforeEach(() => {
  document.body.innerHTML = '';
  disconnect.mockClear();

  (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = class {
    constructor(cb: Observe, opts?: IntersectionObserverInit) {
      callback = cb;
      options = opts;
    }
    observe = vi.fn();
    disconnect = disconnect;
  };
});

describe('siteNav', () => {
  it('leaves the bar solid when the page has no hero image', () => {
    const component = create();
    component.init?.();

    expect(component.$el.classList.contains('navbar-overlay')).toBe(false);
  });

  it('leaves the bar solid without IntersectionObserver', () => {
    document.body.innerHTML = '<div class="article-image"></div>';
    // @ts-expect-error: simulating a browser without IntersectionObserver
    delete window.IntersectionObserver;
    const component = create();
    component.init?.();

    expect(component.$el.classList.contains('navbar-overlay')).toBe(false);
  });

  it('watches the hero below the bar, by shrinking the viewport from the top by its height', () => {
    document.body.innerHTML = '<div class="article-image"></div>';
    create().init?.();

    expect(options?.rootMargin).toBe('-52px 0px 0px 0px');
  });

  it('keeps the overlay while the hero is behind the bar, removes it when not, and restores it', () => {
    document.body.innerHTML = '<div class="article-image"></div>';
    const component = create();
    component.init?.();

    callback([{ isIntersecting: true }]);
    expect(component.$el.classList.contains('navbar-overlay')).toBe(true);

    callback([{ isIntersecting: false }]);
    expect(component.$el.classList.contains('navbar-overlay')).toBe(false);

    callback([{ isIntersecting: true }]);
    expect(component.$el.classList.contains('navbar-overlay')).toBe(true);
  });

  it('stops observing when destroyed', () => {
    document.body.innerHTML = '<div class="article-image"></div>';
    const component = create();
    component.init?.();
    component.destroy?.();

    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
