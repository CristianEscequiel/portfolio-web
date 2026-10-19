import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Reveal } from './reveal';

@Component({
  imports: [Reveal],
  template: `<section class="reveal">contenido</section>`,
})
class Host {}

describe('Reveal', () => {
  let callback: IntersectionObserverCallback;
  let observe: jasmine.Spy;
  let disconnect: jasmine.Spy;
  let original: typeof IntersectionObserver;

  beforeEach(() => {
    observe = jasmine.createSpy('observe');
    disconnect = jasmine.createSpy('disconnect');
    class FakeObserver {
      observe = observe;
      disconnect = disconnect;
      constructor(cb: IntersectionObserverCallback) {
        callback = cb;
      }
    }
    original = window.IntersectionObserver;
    window.IntersectionObserver = FakeObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    window.IntersectionObserver = original;
  });

  function render(): HTMLElement {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('section');
  }

  it('observa el elemento y no lo muestra hasta que entra en pantalla', () => {
    const section = render();

    expect(observe).toHaveBeenCalledWith(section);
    expect(section.classList).not.toContain('is-visible');
  });

  it('agrega is-visible y deja de observar cuando entra en pantalla', () => {
    const section = render();

    callback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);

    expect(section.classList).toContain('is-visible');
    expect(disconnect).toHaveBeenCalled();
  });

  it('no agrega is-visible mientras no intersecta', () => {
    const section = render();

    callback([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver);

    expect(section.classList).not.toContain('is-visible');
  });

  it('desconecta el observer al destruirse', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();

    fixture.destroy();

    expect(disconnect).toHaveBeenCalled();
  });
});
