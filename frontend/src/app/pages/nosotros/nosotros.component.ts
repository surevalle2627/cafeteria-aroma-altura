import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { GaleriaItem, NosotrosInfo } from '../../models/cafeteria.models';
import { CafeteriaService } from '../../services/cafeteria.service';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css',
})
export class NosotrosComponent implements OnInit {
  private readonly cafeteriaService = inject(CafeteriaService);

  @ViewChild('galleryDialog') galleryDialog?: ElementRef<HTMLDialogElement>;

  readonly nosotros = signal<NosotrosInfo | null>(null);
  readonly galeria = signal<GaleriaItem[]>([]);
  readonly selectedPhoto = signal<GaleriaItem | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  private pressedOutside = false;

  ngOnInit(): void {
    this.cargarNosotros();
  }

  cargarNosotros(forceRefresh = false): void {
    this.loading.set(true);
    this.error.set(null);

    this.cafeteriaService.getNosotros(forceRefresh).subscribe({
      next: (res) => {
        this.nosotros.set(res.nosotros);
        const sorted = [...(res.galeria ?? [])].sort((a, b) => a.orden - b.orden);
        this.galeria.set(sorted);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la información institucional.');
        this.loading.set(false);
      },
    });
  }

  openPhoto(item: GaleriaItem): void {
    this.selectedPhoto.set(item);
    const dialog = this.galleryDialog?.nativeElement;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }

  closePhoto(): void {
    const dialog = this.galleryDialog?.nativeElement;
    if (dialog?.open) {
      dialog.close();
    }
    this.selectedPhoto.set(null);
  }

  onDialogPointerDown(event: PointerEvent): void {
    const dialog = this.galleryDialog?.nativeElement;
    if (!dialog) {
      return;
    }
    this.pressedOutside = this.isOutsideDialog(event, dialog);
  }

  onDialogPointerUp(event: PointerEvent): void {
    const dialog = this.galleryDialog?.nativeElement;
    if (!dialog) {
      return;
    }
    if (this.pressedOutside && this.isOutsideDialog(event, dialog)) {
      this.closePhoto();
    }
    this.pressedOutside = false;
  }

  private isOutsideDialog(event: PointerEvent, dialog: HTMLDialogElement): boolean {
    const rect = dialog.getBoundingClientRect();
    return (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    );
  }
}
