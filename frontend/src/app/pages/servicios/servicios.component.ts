import { Component, OnInit, inject, signal } from '@angular/core';
import { Servicio } from '../../models/cafeteria.models';
import { CafeteriaService } from '../../services/cafeteria.service';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css',
})
export class ServiciosComponent implements OnInit {
  private readonly cafeteriaService = inject(CafeteriaService);

  readonly servicios = signal<Servicio[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(forceRefresh = false): void {
    this.loading.set(true);
    this.error.set(null);

    this.cafeteriaService.getServicios(forceRefresh).subscribe({
      next: (res) => {
        this.servicios.set(res.servicios ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los servicios desde el servidor.');
        this.loading.set(false);
      },
    });
  }
}
