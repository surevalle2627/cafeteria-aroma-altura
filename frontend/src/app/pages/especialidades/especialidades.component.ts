import { Component, OnInit, inject, signal } from '@angular/core';
import { EspecialidadCardComponent } from '../../components/especialidad-card/especialidad-card.component';
import { Producto } from '../../models/cafeteria.models';
import { CafeteriaService } from '../../services/cafeteria.service';

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [EspecialidadCardComponent],
  templateUrl: './especialidades.component.html',
  styleUrl: './especialidades.component.css',
})
export class EspecialidadesComponent implements OnInit {
  private readonly cafeteriaService = inject(CafeteriaService);

  readonly especialidades = signal<Producto[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.cargarEspecialidades();
  }

  cargarEspecialidades(forceRefresh = false): void {
    this.loading.set(true);
    this.error.set(null);

    this.cafeteriaService.getEspecialidades(forceRefresh).subscribe({
      next: (res) => {
        this.especialidades.set(res.especialidades ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las especialidades desde el servidor.');
        this.loading.set(false);
      },
    });
  }
}
