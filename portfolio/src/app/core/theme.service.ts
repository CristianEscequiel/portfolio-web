import { Injectable, computed, effect, signal } from '@angular/core';

export type Theme = 'corporate' | 'business';

export const THEME_STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.initialTheme());
  readonly isDark = computed(() => this.theme() === 'business');

  constructor() {
    effect(() => document.documentElement.setAttribute('data-theme', this.theme()));
  }

  setDark(dark: boolean): void {
    const theme: Theme = dark ? 'business' : 'corporate';
    this.theme.set(theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Sin almacenamiento (modo privado, datos bloqueados): el tema vale solo para esta visita.
    }
  }

  private initialTheme(): Theme {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'corporate' || saved === 'business') {
        return saved;
      }
    } catch {
      // Se ignora y se usa la preferencia del sistema.
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'business' : 'corporate';
  }
}
