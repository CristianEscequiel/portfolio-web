import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { API_BASE_URL } from '../../core/api-base-url.token';
import {
  CONTACT_REQUEST_TIMEOUT_MS,
  ContactApiService,
  ContactError,
  ContactPayload,
} from './contact-api.service';

describe('ContactApiService', () => {
  const payload: ContactPayload = {
    name: 'Ana Pérez',
    email: 'ana@ejemplo.com',
    message: 'Hola, me gustaría hablar.',
    website: '',
  };

  let service: ContactApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'https://api.test/api' },
      ],
    });
    service = TestBed.inject(ContactApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  /** Envía, responde con el error indicado y devuelve el ContactError resultante. */
  function failWith(status: number, body: object | string | null = null): ContactError {
    let result: ContactError | undefined;
    service.send(payload).subscribe({ error: (e: ContactError) => (result = e) });
    http.expectOne('https://api.test/api/contact').flush(body, { status, statusText: 'x' });
    expect(result).toBeDefined();
    return result as ContactError;
  }

  it('envía un POST JSON a API_BASE_URL + /contact con los cuatro campos', () => {
    let done = false;
    service.send(payload).subscribe(() => (done = true));

    const req = http.expectOne('https://api.test/api/contact');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ message: 'ok' }, { status: 201, statusText: 'Created' });

    expect(done).toBeTrue();
  });

  it('mapea un 400 con mensajes "campo: texto" a errores por campo', () => {
    const error = failWith(400, {
      statusCode: 400,
      message: ['name: El nombre es corto', 'email: Email inválido', 'email: otro'],
    });

    expect(error).toEqual({
      kind: 'validation',
      fields: { name: 'El nombre es corto', email: 'Email inválido' },
    });
  });

  it('mapea un 400 sin campos identificables a un mensaje general', () => {
    const error = failWith(400, { message: ['property role should not exist'] });

    expect(error.kind).toBe('validation');
    if (error.kind === 'validation') {
      expect(error.fields).toEqual({});
      expect(error.general).toBeTruthy();
    }
  });

  it('mantiene los errores por campo y agrega un mensaje general si además hay mensajes sin campo', () => {
    const error = failWith(400, { message: ['name: corto', 'property x should not exist'] });

    expect(error.kind).toBe('validation');
    if (error.kind === 'validation') {
      expect(error.fields).toEqual({ name: 'corto' });
      expect(error.general).toBeTruthy();
    }
  });

  it('mapea un 400 con cuerpo inesperado a un mensaje general', () => {
    const error = failWith(400, 'texto plano');

    expect(error.kind).toBe('validation');
    if (error.kind === 'validation') {
      expect(error.general).toBeTruthy();
    }
  });

  it('mapea 429 a rate-limit', () => {
    expect(failWith(429, { message: 'Demasiados intentos' })).toEqual({ kind: 'rate-limit' });
  });

  it('mapea 500 y 503 a server', () => {
    expect(failWith(500)).toEqual({ kind: 'server' });
    expect(failWith(503, { message: 'No pudimos enviar' })).toEqual({ kind: 'server' });
  });

  it('mapea un error de red (status 0) a network', () => {
    let result: ContactError | undefined;
    service.send(payload).subscribe({ error: (e: ContactError) => (result = e) });

    http.expectOne('https://api.test/api/contact').error(new ProgressEvent('error'));

    expect(result).toEqual({ kind: 'network' });
  });

  it('cancela la petición y devuelve timeout a los 15 segundos sin respuesta', fakeAsync(() => {
    let result: ContactError | undefined;
    service.send(payload).subscribe({ error: (e: ContactError) => (result = e) });
    const req = http.expectOne('https://api.test/api/contact');

    tick(CONTACT_REQUEST_TIMEOUT_MS - 1);
    expect(result).toBeUndefined();

    tick(1);
    expect(result).toEqual({ kind: 'timeout' });
    expect(req.cancelled).toBeTrue();
  }));
});
