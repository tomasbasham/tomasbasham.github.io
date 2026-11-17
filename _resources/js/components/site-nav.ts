import type { AlpineComponent } from 'alpinejs';

interface SiteNavProps {
  observer: IntersectionObserver | null;
}

type SiteNavComponent = AlpineComponent<SiteNavProps>;

/**
 * Keeps the navigation bar translucent while it is over an article's hero
 * image, and makes it solid once the image has scrolled out from under it.
 *
 * The page renders the bar translucent (`navbar-overlay`), so there is no flash
 * of solid bar on load; this only removes the class once the hero's bottom edge
 * passes above the bar, and puts it back if the visitor scrolls up again.
 * Without an observer (or a hero) the bar is left solid.
 */
export default (): SiteNavComponent => ({
  observer: null,

  init() {
    const hero = document.querySelector('.article-image');
    const solid = (): void => this.$el.classList.remove('navbar-overlay');

    if (!hero || typeof IntersectionObserver !== 'function') {
      solid();
      return;
    }

    // The hero is "behind the bar" while any of it is below the bar's bottom
    // edge, so shrink the observed area from the top by the bar's height.
    this.observer = new IntersectionObserver(
      ([entry]) => this.$el.classList.toggle('navbar-overlay', entry?.isIntersecting ?? false),
      { rootMargin: `-${this.$el.offsetHeight}px 0px 0px 0px` },
    );
    this.observer.observe(hero);
  },

  destroy() {
    this.observer?.disconnect();
    this.observer = null;
  },
});
