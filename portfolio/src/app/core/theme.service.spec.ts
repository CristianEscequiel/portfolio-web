import { TestBed } from '@angular/core/testing';

import { THEME_STORAGE_KEY, ThemeService } from './theme.service';

describe('ThemeService', () => {
  function mockPrefersDark(dark: boolean): void {
    spyOn(window, 'matchMedia').and.returnValue({ matches: dark } as MediaQueryList);
  }

  beforeEach(() => {
    localStorage.removeItem(THEME_STORAGE_KEY);
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    localStorage.removeItem(THEME_STORAGE_KEY);
    document.documentElement.removeAttribute('data-theme');
  });

  it('usa la preferencia oscura del sistema si no hay tema guardado', () => {
    mockPrefersDark(true);
    expect(TestBed.inject(ThemeService).theme()).toBe('business');
  });

  it('usa el tema claro si el sistema no prefiere oscuro y no hay tema guardado', () => {
    mockPrefersDark(false);
    expect(TestBed.inject(ThemeService).theme()).toBe('corporate');
  });

  it('prioriza el tema guardado sobre la preferencia del sistema', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'corporate');
    mockPrefersDark(true);
    expect(TestBed.inject(ThemeService).theme()).toBe('corporate');
  });

  it('ignora un valor guardado inválido', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'otro');
    mockPrefersDark(false);
    expect(TestBed.inject(ThemeService).theme()).toBe('corporate');
  });

  it('setDark cambia el tema, lo guarda y lo aplica al documento', () => {
    mockPrefersDark(false);
    const service = TestBed.inject(ThemeService);

    service.setDark(true);
    TestBed.tick();

    expect(service.isDark()).toBeTrue();
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('business');
    expect(document.documentElement.getAttribute('data-theme')).toBe('business');

    service.setDark(false);
    TestBed.tick();

    expect(service.isDark()).toBeFalse();
    expect(document.documentElement.getAttribute('data-theme')).toBe('corporate');
  });

  it('sigue funcionando si localStorage lanza error', () => {
    mockPrefersDark(true);
    spyOn(Storage.prototype, 'getItem').and.throwError('bloqueado');
    spyOn(Storage.prototype, 'setItem').and.throwError('bloqueado');
    const service = TestBed.inject(ThemeService);

    expect(service.theme()).toBe('business');
    expect(() => service.setDark(false)).not.toThrow();
    expect(service.theme()).toBe('corporate');
  });
});
