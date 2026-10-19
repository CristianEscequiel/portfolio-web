import { Directive, DestroyRef, ElementRef, inject } from '@angular/core';

/** Muestra el elemento con una animación la primera vez que entra en pantalla (clase `reveal`). */
@Directive({ selector: '.reveal' })
export class Reveal {
  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          element.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(element);

    inject(DestroyRef).onDestroy(() => observer.disconnect());
  }
}
