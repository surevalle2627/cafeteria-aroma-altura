export interface ConfigInicio {
  id: number;
  titulo_hero: string;
  subtitulo: string;
  descripcion: string;
  video_pexels_url: string;
  texto_boton: string;
  ruta_boton: string;
  actualizado_en: string;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
  imagen_url: string;
  horario_disponible: string;
  activo: number;
}

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  precio: string | number;
  tamanio: string;
  es_especialidad: number;
  notas_cata: string | null;
  imagen_url: string;
  disponible: number;
}

export interface NosotrosInfo {
  id: number;
  nombre_cafeteria: string;
  eslogan: string;
  historia: string;
  mision: string;
  vision: string;
  direccion: string;
  ciudad: string;
  telefono: string;
  email: string;
  horario_atencion: string;
  mapa_url: string;
}

export interface GaleriaItem {
  id: number;
  titulo: string;
  descripcion: string;
  imagen_url: string;
  orden: number;
}

export interface InicioResponse {
  ok: boolean;
  config: ConfigInicio | null;
  especialidades: Producto[];
}

export interface ServiciosResponse {
  ok: boolean;
  servicios: Servicio[];
}

export interface EspecialidadesResponse {
  ok: boolean;
  especialidades: Producto[];
}

export interface PreciosResponse {
  ok: boolean;
  productos: Producto[];
}

export interface NosotrosResponse {
  ok: boolean;
  nosotros: NosotrosInfo | null;
  galeria: GaleriaItem[];
}

export interface ContactoPayload {
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
}

export interface ContactoResponse {
  ok: boolean;
  id: number;
  mensaje: string;
}

export interface ChatbotRequest {
  mensaje: string;
}

export interface ChatbotResponse {
  ok: boolean;
  respuesta: string;
}

export interface ChatMessage {
  id: string;
  autor: 'usuario' | 'barista';
  texto: string;
  hora: string;
}
