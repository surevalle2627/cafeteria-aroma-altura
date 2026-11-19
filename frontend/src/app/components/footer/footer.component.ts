import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NosotrosInfo } from '../../models/cafeteria.models';
import { CafeteriaService } from '../../services/cafeteria.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {
  private readonly cafeteriaService = inject(CafeteriaService);

  readonly nosotros = signal<NosotrosInfo | null>(null);
  readonly currentYear = new Date().getFullYear();

  readonly navLinks = [
    { label: 'Inicio', path: '/inicio' },
    { label: 'Servicios', path: '/servicios' },
    { label: 'Especialidades', path: '/especialidades' },
    { label: 'Nosotros', path: '/nosotros' },
    { label: 'Precios', path: '/precios' },
    { label: 'Contactos', path: '/contactos' },
  ];

  ngOnInit(): void {
    this.cafeteriaService.getNosotros().subscribe({
      next: (res) => this.nosotros.set(res.nosotros),
      error: () => {
        // Sin datos estáticos quemados si falla la conexión
      },
    });
  }
}
