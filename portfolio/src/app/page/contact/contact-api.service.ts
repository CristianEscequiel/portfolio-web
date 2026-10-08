import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, TimeoutError, catchError, map, throwError, timeout } from 'rxjs';
import { API_BASE_URL } from '../../core/api-base-url.token';

export const CONTACT_REQUEST_TIMEOUT_MS = 15000;

export type ContactField = 'name' | 'email' | 'message';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  /** Honeypot: siempre vacío para una persona. */
  website: string;
}

export type ContactError =
  | { kind: 'validation'; fields: Partial<Record<ContactField, string>>; general?: string }
  | { kind: 'rate-limit' }
  | { kind: 'server' }
  | { kind: 'network' }
  | { kind: 'timeout' };

const FIELD_MESSAGE = /^(name|email|message): ([\s\S]+)$/;

/** Traduce el error HTTP del backend al tipo propio que usa el formulario. */
export function toContactError(error: unknown): ContactError {
  if (error instanceof TimeoutError) {
    return { kind: 'timeout' };
  }
  if (!(error instanceof HttpErrorResponse)) {
    return { kind: 'server' };
  }
  if (error.status === 0) {
    return { kind: 'network' };
  }
  if (error.status === 429) {
    return { kind: 'rate-limit' };
  }
  if (error.status === 400) {
    return toValidationError(error.error);
  }
  return { kind: 'server' };
}

function toValidationError(body: unknown): ContactError {
  const raw = (body as { message?: unknown } | null)?.message;
  const messages = Array.isArray(raw) ? raw : typeof raw === 'string' ? [raw] : [];
  const fields: Partial<Record<ContactField, string>> = {};
  const unmatched: string[] = [];

  for (const message of messages) {
    const match = typeof message === 'string' ? FIELD_MESSAGE.exec(message) : null;
    if (match) {
      const field = match[1] as ContactField;
      fields[field] ??= match[2];
    } else if (typeof message === 'string') {
      unmatched.push(message);
    }
  }

  const hasFields = Object.keys(fields).length > 0;
  if (!hasFields || unmatched.length > 0) {
    return {
      kind: 'validation',
      fields,
      general: 'Revisá los datos del formulario e intentá de nuevo.',
    };
  }
  return { kind: 'validation', fields };
}

@Injectable({ providedIn: 'root' })
export class ContactApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  /** Emite un único valor al enviarse; ante cualquier fallo el error del observable es un ContactError. */
  send(payload: ContactPayload): Observable<void> {
    return this.http.post(`${this.baseUrl}/contact`, payload).pipe(
      timeout(CONTACT_REQUEST_TIMEOUT_MS),
      map(() => undefined),
      catchError((error: unknown) => throwError(() => toContactError(error))),
    );
  }
}
