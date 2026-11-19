import { Routes } from '@angular/router';
import { ContactosComponent } from './pages/contactos/contactos.component';
import { EspecialidadesComponent } from './pages/especialidades/especialidades.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { PreciosComponent } from './pages/precios/precios.component';
import { ServiciosComponent } from './pages/servicios/servicios.component';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent, title: 'Inicio | Aroma & Altura Café' },
  { path: 'servicios', component: ServiciosComponent, title: 'Servicios | Aroma & Altura Café' },
  {
    path: 'especialidades',
    component: EspecialidadesComponent,
    title: 'Especialidades | Aroma & Altura Café',
  },
  { path: 'nosotros', component: NosotrosComponent, title: 'Nosotros | Aroma & Altura Café' },
  { path: 'precios', component: PreciosComponent, title: 'Carta & Precios | Aroma & Altura Café' },
  { path: 'contactos', component: ContactosComponent, title: 'Contactos | Aroma & Altura Café' },
  { path: '**', redirectTo: 'inicio' },
];
