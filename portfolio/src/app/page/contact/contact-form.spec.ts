import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { ContactApiService, ContactError, ContactPayload } from './contact-api.service';
import { ContactForm } from './contact-form';

const CONTACT_EMAIL = 'contacto@ejemplo.com';

describe('ContactForm', () => {
  let fixture: ComponentFixture<ContactForm>;
  let root: HTMLElement;
  let response$: Subject<void>;
  let send: jasmine.Spy<(payload: ContactPayload) => Subject<void>>;

  beforeEach(async () => {
    response$ = new Subject<void>();
    send = jasmine.createSpy('send').and.callFake(() => response$);

    await TestBed.configureTestingModule({
      imports: [ContactForm],
      providers: [{ provide: ContactApiService, useValue: { send } }],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactForm);
    fixture.componentRef.setInput('contactEmail', CONTACT_EMAIL);
    fixture.detectChanges();
    root = fixture.nativeElement as HTMLElement;
  });

  const el = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector) as T;

  function type(selector: string, value: string): void {
    const input = el<HTMLInputElement | HTMLTextAreaElement>(selector);
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function blur(selector: string): void {
    el(selector).dispatchEvent(new Event('blur'));
    fixture.detectChanges();
  }

  function fillValid(): void {
    type('#contact-name', '  Ana Pérez ');
    type('#contact-email', 'ana@ejemplo.com');
    type('#contact-message', 'Hola, me gustaría hablar de un proyecto.');
  }

  function submit(): void {
    el('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  function fail(error: ContactError): void {
    response$.error(error);
    fixture.detectChanges();
  }

  const text = () => root.textContent ?? '';
  const submitButton = () => el<HTMLButtonElement>('button[type="submit"]');

  describe('validación', () => {
    it('al inicio no muestra errores ni el email de contacto', () => {
      expect(root.querySelectorAll('.text-error').length).toBe(0);
      expect(text()).not.toContain(CONTACT_EMAIL);
      expect(text()).not.toContain('Copiar');
    });

    it('muestra el error de un campo inválido al salir de él y lo quita al corregirlo', () => {
      type('#contact-name', 'a');
      blur('#contact-name');

      expect(el('#contact-name-error').textContent).toContain('entre 2 y 80');

      type('#contact-name', 'Ana');
      expect(root.querySelector('#contact-name-error')).toBeNull();
    });

    it('valida el formato del email', () => {
      for (const invalid of ['sin-arroba', 'a@b', 'a@b.c', 'a b@c.com']) {
        type('#contact-email', invalid);
        blur('#contact-email');
        expect(root.querySelector('#contact-email-error')).withContext(invalid).not.toBeNull();
      }
      type('#contact-email', 'ana@ejemplo.com');
      expect(root.querySelector('#contact-email-error')).toBeNull();
    });

    it('valida el largo del mensaje sobre el valor recortado', () => {
      type('#contact-message', '   corto   ');
      blur('#contact-message');
      expect(el('#contact-message-error').textContent).toContain('entre 10 y 2000');

      type('#contact-message', 'a'.repeat(2001));
      expect(root.querySelector('#contact-message-error')).not.toBeNull();

      type('#contact-message', 'a'.repeat(2000));
      expect(root.querySelector('#contact-message-error')).toBeNull();
    });

    it('un envío inválido no llama al servicio y deja el foco en el primer campo inválido', () => {
      type('#contact-email', 'ana@ejemplo.com');
      document.body.appendChild(root);

      submit();

      expect(send).not.toHaveBeenCalled();
      expect(document.activeElement).toBe(el('#contact-name'));
      expect(el('#contact-name').getAttribute('aria-invalid')).toBe('true');
      expect(el('#contact-message').getAttribute('aria-invalid')).toBe('true');
      expect(el('#contact-email').getAttribute('aria-invalid')).toBeNull();
      root.remove();
    });

    it('asocia cada mensaje de error al campo con aria-describedby', () => {
      submit();

      expect(el('#contact-name').getAttribute('aria-describedby')).toBe('contact-name-error');
      expect(el('#contact-email').getAttribute('aria-describedby')).toBe('contact-email-error');
      expect(el('#contact-message').getAttribute('aria-describedby')).toContain(
        'contact-message-error',
      );
      expect(root.querySelector('#contact-name-error')).not.toBeNull();
    });

    it('cada campo visible tiene una etiqueta asociada', () => {
      for (const id of ['contact-name', 'contact-email', 'contact-message']) {
        expect(root.querySelector(`label[for="${id}"]`))
          .withContext(id)
          .not.toBeNull();
      }
    });

    it('muestra el contador de caracteres del mensaje', () => {
      expect(el('#contact-message-count').textContent).toContain('0 / 2000');

      type('#contact-message', 'hola');

      expect(el('#contact-message-count').textContent).toContain('4 / 2000');
    });
  });

  describe('honeypot', () => {
    it('existe, está oculto para lectores de pantalla y no se puede enfocar con teclado', () => {
      const trap = el<HTMLInputElement>('#contact-hp');

      expect(trap).not.toBeNull();
      expect(trap.tabIndex).toBe(-1);
      expect(trap.getAttribute('autocomplete')).toBe('off');
      expect(trap.closest('[aria-hidden="true"]')).not.toBeNull();
      expect(trap.closest('.absolute')).not.toBeNull();
    });

    it('se envía vacío para una persona y con su valor si lo completa un bot', () => {
      fillValid();
      submit();
      expect(send.calls.mostRecent().args[0].website).toBe('');

      response$.next();
      response$.complete();
      response$ = new Subject<void>();

      fillValid();
      type('#contact-hp', 'http://spam.example');
      submit();
      expect(send.calls.mostRecent().args[0].website).toBe('http://spam.example');
    });
  });

  describe('envío', () => {
    it('envía los datos recortados y muestra el estado "enviando" con el botón deshabilitado', () => {
      fillValid();

      submit();

      expect(send).toHaveBeenCalledOnceWith({
        name: 'Ana Pérez',
        email: 'ana@ejemplo.com',
        message: 'Hola, me gustaría hablar de un proyecto.',
        website: '',
      });
      expect(submitButton().disabled).toBeTrue();
      expect(submitButton().textContent).toContain('Enviando…');
      expect(text()).not.toContain(CONTACT_EMAIL);
    });

    it('ignora un segundo envío mientras hay uno en curso', () => {
      fillValid();
      submit();
      submit();

      expect(send).toHaveBeenCalledTimes(1);
    });

    it('ante el éxito muestra el mensaje en la región viva y vacía el formulario', () => {
      fillValid();
      submit();

      response$.next();
      response$.complete();
      fixture.detectChanges();

      expect(el('[role="status"]').textContent).toContain('Recibí tu mensaje');
      expect(el<HTMLInputElement>('#contact-name').value).toBe('');
      expect(el<HTMLTextAreaElement>('#contact-message').value).toBe('');
      expect(el('#contact-message-count').textContent).toContain('0 / 2000');
      expect(submitButton().disabled).toBeFalse();
      expect(submitButton().textContent).toContain('Enviar mensaje');
      expect(text()).not.toContain(CONTACT_EMAIL);
    });

    it('ante un 429 muestra el aviso de demasiados intentos en la región de alertas', () => {
      fillValid();
      submit();

      fail({ kind: 'rate-limit' });

      expect(el('[role="alert"]').textContent).toContain('demasiados intentos');
      expect(text()).not.toContain(CONTACT_EMAIL);
      expect(submitButton().disabled).toBeFalse();
    });

    it('ante un 400 con campos identificados muestra cada error bajo su campo', () => {
      fillValid();
      submit();

      fail({ kind: 'validation', fields: { email: 'Ingresá un email válido' } });

      expect(el('#contact-email-error').textContent).toContain('Ingresá un email válido');
      expect(el('#contact-email').getAttribute('aria-invalid')).toBe('true');
      expect(root.querySelector('#contact-name-error')).toBeNull();
    });

    it('ante un 400 sin campos muestra un mensaje general', () => {
      fillValid();
      submit();

      fail({ kind: 'validation', fields: {}, general: 'Revisá los datos del formulario.' });

      expect(el('[role="alert"]').textContent).toContain('Revisá los datos del formulario.');
    });

    it('el error de servidor de un campo desaparece al corregirlo', () => {
      fillValid();
      submit();
      fail({ kind: 'validation', fields: { email: 'Ingresá un email válido' } });

      type('#contact-email', 'otro@ejemplo.com');

      expect(root.querySelector('#contact-email-error')).toBeNull();
    });

    for (const kind of ['server', 'network', 'timeout'] as const) {
      it(`ante un error ${kind} muestra el email como alternativa y conserva lo escrito`, () => {
        fillValid();
        submit();

        fail({ kind });

        const alert = el('[role="alert"]');
        expect(alert.textContent).toContain('No pudimos enviar tu mensaje');
        expect(alert.querySelector<HTMLAnchorElement>('a')?.getAttribute('href')).toBe(
          `mailto:${CONTACT_EMAIL}`,
        );
        expect(alert.textContent).toContain(CONTACT_EMAIL);
        expect(el<HTMLInputElement>('#contact-name').value).toBe('  Ana Pérez ');
        expect(el<HTMLTextAreaElement>('#contact-message').value).toContain('proyecto');
      });
    }

    it('permite reenviar después de un error sin recargar la página', () => {
      fillValid();
      submit();
      fail({ kind: 'server' });
      response$ = new Subject<void>();

      expect(submitButton().disabled).toBeFalse();
      submit();

      expect(send).toHaveBeenCalledTimes(2);
      expect(submitButton().disabled).toBeTrue();
    });

    it('limpia el error anterior al reintentar', () => {
      fillValid();
      submit();
      fail({ kind: 'server' });
      response$ = new Subject<void>();

      submit();

      expect(el('[role="alert"]').textContent?.trim()).toBe('');
    });
  });
});
