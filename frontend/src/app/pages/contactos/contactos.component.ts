import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NosotrosInfo } from '../../models/cafeteria.models';
import { CafeteriaService } from '../../services/cafeteria.service';

@Component({
  selector: 'app-contactos',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contactos.component.html',
  styleUrl: './contactos.component.css',
})
export class ContactosComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cafeteriaService = inject(CafeteriaService);

  @ViewChild('contactFormEl') contactFormEl?: ElementRef<HTMLFormElement>;

  readonly nosotros = signal<NosotrosInfo | null>(null);
  readonly isSubmitting = signal(false);
  readonly submitAttempted = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
    telefono: [''],
    asunto: ['', [Validators.required, Validators.minLength(3)]],
    mensaje: ['', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit(): void {
    this.cafeteriaService.getNosotros().subscribe({
      next: (res) => this.nosotros.set(res.nosotros),
      error: () => {
        // Sin datos quemados si falla la conexión
      },
    });
  }

  isFieldInvalid(fieldName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[fieldName];
    return control.invalid && (control.touched || this.submitAttempted());
  }

  describedBy(hintId: string, errorId: string, fieldName: keyof typeof this.form.controls): string {
    return this.isFieldInvalid(fieldName) ? `${hintId} ${errorId}` : hintId;
  }

  onSubmit(): void {
    this.submitAttempted.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusFirstInvalidField();
      return;
    }

    const raw = this.form.getRawValue();
    this.isSubmitting.set(true);

    this.cafeteriaService
      .enviarContacto({
        nombre: raw.nombre.trim(),
        email: raw.email.trim(),
        telefono: raw.telefono.trim(),
        asunto: raw.asunto.trim(),
        mensaje: raw.mensaje.trim(),
      })
      .subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.successMessage.set(res.mensaje);
          this.submitAttempted.set(false);
          this.form.reset();
        },
        error: (err) => {
          this.isSubmitting.set(false);
          const detalles = err?.error?.detalles;
          if (Array.isArray(detalles) && detalles.length > 0) {
            this.errorMessage.set(detalles.join(' '));
          } else {
            this.errorMessage.set(
              err?.error?.error || 'No fue posible enviar tu mensaje. Intenta nuevamente.'
            );
          }
        },
      });
  }

  private focusFirstInvalidField(): void {
    setTimeout(() => {
      const formEl = this.contactFormEl?.nativeElement;
      const firstInvalid = formEl?.querySelector<HTMLElement>('[aria-invalid="true"]');
      firstInvalid?.focus();
    });
  }
}
