import type { AlpineComponent } from 'alpinejs';

interface ParallaxHeaderProps {
  images: NodeListOf<HTMLElement>;
  postContent: HTMLElement | null;
  articleImage: HTMLElement | null;
}

type ParallaxHeaderCompoment = AlpineComponent<ParallaxHeaderProps & {
  handleScroll: () => void;
}>;

export default (): ParallaxHeaderCompoment => ({
  images: null!,
  postContent: null,
  articleImage: null,

  init() {
    // Cache elements
    this.images = this.$el.querySelectorAll('.post-image-image, .teaserimage-image');
    this.postContent = this.$el.querySelector('.post-content');
    this.articleImage = this.$el.querySelector('.article-image');

    // Set up parallax scrolling
    this.handleScroll();
    window.addEventListener('scroll', () => this.handleScroll());

    // Set padding based on article image height
    if (this.articleImage && this.postContent) {
      const height = this.articleImage.offsetHeight;
      this.postContent.style.paddingTop = `${height}px`;
    }
  },

  handleScroll() {
    const top = window.scrollY;
    if (top < 0 || top > 1500) {
      return;
    }

    this.images.forEach(image => {
      image.style.transform = `translate3d(0px, ${top / 3}px, 0px)`;
      image.style.opacity = `${1 - Math.max(top / 700, 0)}`;
    });
  },
});
