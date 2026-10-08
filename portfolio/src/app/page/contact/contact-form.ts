import { toSignal } from '@angular/core/rxjs-interop';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { map, startWith } from 'rxjs';
import { ContactApiService, ContactError, ContactField } from './contact-api.service';

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  emailMax: 254,
  messageMin: 10,
  messageMax: 2000,
} as const;

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

const FIELDS: readonly ContactField[] = ['name', 'email', 'message'];
const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Largo del valor sin espacios en los extremos, igual que hace el backend antes de validar. */
function trimmedLength(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const length = String(control.value ?? '').trim().length;
    return length < min || length > max ? { length: { min, max, actual: length } } : null;
  };
}

function emailFormat(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();
    return value.length > 0 && value.length <= max && EMAIL_FORMAT.test(value)
      ? null
      : { email: true };
  };
}

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactForm {
  private readonly api = inject(ContactApiService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly fb = inject(NonNullableFormBuilder);

  /** Email de contacto: solo se muestra como alternativa cuando falla el envío. */
  readonly contactEmail = input.required<string>();

  readonly limits = CONTACT_LIMITS;

  readonly form = this.fb.group({
    name: ['', trimmedLength(CONTACT_LIMITS.nameMin, CONTACT_LIMITS.nameMax)],
    email: ['', emailFormat(CONTACT_LIMITS.emailMax)],
    message: ['', trimmedLength(CONTACT_LIMITS.messageMin, CONTACT_LIMITS.messageMax)],
    // Honeypot: ningún usuario lo ve ni lo completa.
    website: [''],
  });

  readonly status = signal<FormStatus>('idle');
  readonly error = signal<ContactError | null>(null);

  readonly messageLength = toSignal(
    this.form.controls.message.valueChanges.pipe(
      map((value) => value.length),
      startWith(0),
    ),
    { initialValue: 0 },
  );

  readonly isSending = computed(() => this.status() === 'sending');

  /** Falla de servidor, red o tiempo de espera: ahí se ofrece el email como alternativa. */
  readonly showEmailFallback = computed(() => {
    const kind = this.error()?.kind;
    return kind === 'server' || kind === 'network' || kind === 'timeout';
  });

  readonly generalError = computed(() => {
    const error = this.error();
    switch (error?.kind) {
      case 'rate-limit':
        return 'Hiciste demasiados intentos. Probá de nuevo en unos minutos.';
      case 'server':
      case 'network':
      case 'timeout':
        return 'No pudimos enviar tu mensaje. Probá de nuevo más tarde o escribime directamente a:';
      case 'validation':
        return error.general ?? null;
      default:
        return null;
    }
  });

  /** Mensaje de error visible bajo el campo, o null si no corresponde mostrarlo. */
  fieldError(field: ContactField): string | null {
    const control = this.form.controls[field];
    if (!control.touched || control.valid) {
      return null;
    }
    const server = control.errors?.['server'] as string | undefined;
    if (server) {
      return server;
    }
    switch (field) {
      case 'name':
        return `El nombre debe tener entre ${CONTACT_LIMITS.nameMin} y ${CONTACT_LIMITS.nameMax} caracteres.`;
      case 'email':
        return 'Ingresá un email válido.';
      case 'message':
        return `El mensaje debe tener entre ${CONTACT_LIMITS.messageMin} y ${CONTACT_LIMITS.messageMax} caracteres.`;
    }
  }

  submit(): void {
    if (this.isSending()) {
      return;
    }

    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.focusFirstInvalid();
      return;
    }

    this.status.set('sending');
    this.error.set(null);

    const { name, email, message, website } = this.form.getRawValue();
    this.api
      .send({ name: name.trim(), email: email.trim(), message: message.trim(), website })
      .subscribe({
        next: () => {
          this.form.reset();
          this.status.set('success');
        },
        error: (error: ContactError) => this.handleError(error),
      });
  }

  private handleError(error: ContactError): void {
    if (error.kind === 'validation') {
      for (const field of FIELDS) {
        const message = error.fields[field];
        if (message) {
          const control = this.form.controls[field];
          control.setErrors({ server: message });
          control.markAsTouched();
        }
      }
      this.focusFirstInvalid();
    }
    this.error.set(error);
    this.status.set('error');
  }

  private focusFirstInvalid(): void {
    const invalid = FIELDS.find((field) => this.form.controls[field].invalid);
    if (invalid) {
      this.host.nativeElement.querySelector<HTMLElement>(`#contact-${invalid}`)?.focus();
    }
  }
}
