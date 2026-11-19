import { Component, Input } from '@angular/core';
import { Producto } from '../../models/cafeteria.models';
import { formatPrecio, parseNotasCata } from '../../services/cafeteria.service';

@Component({
  selector: 'app-especialidad-card',
  standalone: true,
  imports: [],
  templateUrl: './especialidad-card.component.html',
  styleUrl: './especialidad-card.component.css',
})
export class EspecialidadCardComponent {
  @Input({ required: true }) producto!: Producto;
  @Input() eagerImage = false;

  get notas(): string[] {
    return parseNotasCata(this.producto.notas_cata);
  }

  get precioFormateado(): string {
    return formatPrecio(this.producto.precio);
  }
}
