import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../models/cafeteria.models';
import { CafeteriaService, formatPrecio, parseNotasCata } from '../../services/cafeteria.service';

@Component({
  selector: 'app-precios',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './precios.component.html',
  styleUrl: './precios.component.css',
})
export class PreciosComponent implements OnInit {
  private readonly cafeteriaService = inject(CafeteriaService);

  private readonly ordenPreferidoCategorias = [
    'Cafés de Especialidad',
    'Métodos de Filtrado',
    'Bebidas Frías',
    'Pastelería Artesanal',
    'Brunch & Salados',
  ];

  readonly productos = signal<Producto[]>([]);
  readonly selectedCategoria = signal<string>('Todas');
  readonly searchQuery = signal<string>('');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly categorias = computed(() => {
    const presentes = new Set(this.productos().map((p) => p.categoria));
    const ordenadas = this.ordenPreferidoCategorias.filter((c) => presentes.has(c));
    const extras = [...presentes].filter((c) => !this.ordenPreferidoCategorias.includes(c));
    return ['Todas', ...ordenadas, ...extras];
  });

  readonly productosFiltrados = computed(() => {
    const cat = this.selectedCategoria();
    const term = this.searchQuery().trim().toLowerCase();

    return this.productos().filter((p) => {
      const matchCat = cat === 'Todas' || p.categoria === cat;
      if (!matchCat) {
        return false;
      }
      if (!term) {
        return true;
      }
      return (
        p.nombre.toLowerCase().includes(term) ||
        p.descripcion.toLowerCase().includes(term) ||
        p.categoria.toLowerCase().includes(term) ||
        (p.notas_cata ?? '').toLowerCase().includes(term)
      );
    });
  });

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(forceRefresh = false): void {
    this.loading.set(true);
    this.error.set(null);

    this.cafeteriaService.getPrecios(forceRefresh).subscribe({
      next: (res) => {
        this.productos.set(res.productos ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la carta de precios.');
        this.loading.set(false);
      },
    });
  }

  selectCategoria(cat: string): void {
    this.selectedCategoria.set(cat);
  }

  contarPorCategoria(cat: string): number {
    if (cat === 'Todas') {
      return this.productos().length;
    }
    return this.productos().filter((p) => p.categoria === cat).length;
  }

  limpiarFiltros(): void {
    this.selectedCategoria.set('Todas');
    this.searchQuery.set('');
  }

  notasDe(producto: Producto): string[] {
    return parseNotasCata(producto.notas_cata);
  }

  precioDe(producto: Producto): string {
    return formatPrecio(producto.precio);
  }
}
