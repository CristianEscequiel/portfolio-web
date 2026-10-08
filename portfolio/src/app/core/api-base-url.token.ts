import { InjectionToken } from '@angular/core';

/** URL base de la API del backend, sin barra final. Se provee en app.config.ts desde environment. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
