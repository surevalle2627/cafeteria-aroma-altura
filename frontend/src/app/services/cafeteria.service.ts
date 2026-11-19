import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, shareReplay, throwError } from 'rxjs';
import {
  ChatbotResponse,
  ContactoPayload,
  ContactoResponse,
  EspecialidadesResponse,
  InicioResponse,
  NosotrosResponse,
  PreciosResponse,
  ServiciosResponse,
} from '../models/cafeteria.models';

@Injectable({
  providedIn: 'root',
})
export class CafeteriaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api';

  private inicio$?: Observable<InicioResponse>;
  private servicios$?: Observable<ServiciosResponse>;
  private especialidades$?: Observable<EspecialidadesResponse>;
  private precios$?: Observable<PreciosResponse>;
  private nosotros$?: Observable<NosotrosResponse>;

  getInicio(forceRefresh = false): Observable<InicioResponse> {
    if (!this.inicio$ || forceRefresh) {
      this.inicio$ = this.http.get<InicioResponse>(`${this.apiUrl}/inicio`).pipe(
        shareReplay({ bufferSize: 1, refCount: false }),
        catchError((err) => {
          this.inicio$ = undefined;
          return throwError(() => err);
        })
      );
    }
    return this.inicio$;
  }

  getServicios(forceRefresh = false): Observable<ServiciosResponse> {
    if (!this.servicios$ || forceRefresh) {
      this.servicios$ = this.http.get<ServiciosResponse>(`${this.apiUrl}/servicios`).pipe(
        shareReplay({ bufferSize: 1, refCount: false }),
        catchError((err) => {
          this.servicios$ = undefined;
          return throwError(() => err);
        })
      );
    }
    return this.servicios$;
  }

  getEspecialidades(forceRefresh = false): Observable<EspecialidadesResponse> {
    if (!this.especialidades$ || forceRefresh) {
      this.especialidades$ = this.http
        .get<EspecialidadesResponse>(`${this.apiUrl}/especialidades`)
        .pipe(
          shareReplay({ bufferSize: 1, refCount: false }),
          catchError((err) => {
            this.especialidades$ = undefined;
            return throwError(() => err);
          })
        );
    }
    return this.especialidades$;
  }

  getPrecios(forceRefresh = false): Observable<PreciosResponse> {
    if (!this.precios$ || forceRefresh) {
      this.precios$ = this.http.get<PreciosResponse>(`${this.apiUrl}/precios`).pipe(
        shareReplay({ bufferSize: 1, refCount: false }),
        catchError((err) => {
          this.precios$ = undefined;
          return throwError(() => err);
        })
      );
    }
    return this.precios$;
  }

  getNosotros(forceRefresh = false): Observable<NosotrosResponse> {
    if (!this.nosotros$ || forceRefresh) {
      this.nosotros$ = this.http.get<NosotrosResponse>(`${this.apiUrl}/nosotros`).pipe(
        shareReplay({ bufferSize: 1, refCount: false }),
        catchError((err) => {
          this.nosotros$ = undefined;
          return throwError(() => err);
        })
      );
    }
    return this.nosotros$;
  }

  enviarContacto(payload: ContactoPayload): Observable<ContactoResponse> {
    return this.http.post<ContactoResponse>(`${this.apiUrl}/contactos`, payload);
  }

  enviarMensajeChatbot(mensaje: string): Observable<ChatbotResponse> {
    return this.http.post<ChatbotResponse>(`${this.apiUrl}/chatbot`, { mensaje });
  }
}

export function parseNotasCata(notas?: string | null): string[] {
  if (!notas) {
    return [];
  }
  return notas
    .split(/,\s*|\s+y\s+/i)
    .map((nota) => nota.trim())
    .filter((nota) => nota.length > 0)
    .map((nota) => nota.charAt(0).toUpperCase() + nota.slice(1));
}

export function formatPrecio(precio: string | number): string {
  const num = typeof precio === 'number' ? precio : Number.parseFloat(precio);
  if (Number.isNaN(num)) {
    return String(precio);
  }
  return `$${num.toFixed(2)}`;
}
