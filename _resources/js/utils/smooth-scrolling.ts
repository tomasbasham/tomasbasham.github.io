export function initSmoothScrolling(): void {
  const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href*=\\#]:not([href=\\#])');

  anchors.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetHash = anchor.hash;
      const targetPathname = anchor.pathname.replace(/^\//, '');
      const currentPathname = location.pathname.replace(/^\//, '');

      if (currentPathname === targetPathname && location.hostname === anchor.hostname) {
        let target = document.querySelector(targetHash);

        if (!target) {
          target = document.querySelector(`[name="${targetHash.slice(1)}"]`);
        }

        if (target instanceof HTMLElement) {
          e.preventDefault();
          window.scrollTo({
            top: target.offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}
