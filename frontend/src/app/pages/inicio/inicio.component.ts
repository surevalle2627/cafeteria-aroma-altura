import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EspecialidadCardComponent } from '../../components/especialidad-card/especialidad-card.component';
import { ConfigInicio, Producto } from '../../models/cafeteria.models';
import { CafeteriaService } from '../../services/cafeteria.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, EspecialidadCardComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent implements OnInit {
  private readonly cafeteriaService = inject(CafeteriaService);

  private videoRef?: ElementRef<HTMLVideoElement>;
  private lastLoadedSrc = '';

  @ViewChild('heroVideo')
  set heroVideo(el: ElementRef<HTMLVideoElement> | undefined) {
    this.videoRef = el;
    if (el && this.videoSrc()) {
      this.iniciarVideo(el.nativeElement, this.videoSrc());
    }
  }

  get heroVideo(): ElementRef<HTMLVideoElement> | undefined {
    return this.videoRef;
  }

  readonly inicio = signal<ConfigInicio | null>(null);
  readonly videoSrc = signal<string>('');
  readonly especialidades = signal<Producto[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly videoPaused = signal(false);

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(forceRefresh = false): void {
    this.loading.set(true);
    this.error.set(null);

    this.cafeteriaService.getInicio(forceRefresh).subscribe({
      next: (res) => {
        this.inicio.set(res.config);
        this.especialidades.set(res.especialidades ?? []);
        const url = res.config?.video_pexels_url ?? '';
        this.videoSrc.set(url);
        this.loading.set(false);

        requestAnimationFrame(() => {
          const videoEl = this.videoRef?.nativeElement;
          if (videoEl && url) {
            this.iniciarVideo(videoEl, url);
          }
        });
      },
      error: () => {
        this.error.set('No se pudo cargar la portada desde el servidor.');
        this.loading.set(false);
      },
    });
  }

  private iniciarVideo(videoEl: HTMLVideoElement, src: string): void {
    if (!src || this.lastLoadedSrc === src) {
      return;
    }
    this.lastLoadedSrc = src;
    videoEl.muted = true;
    videoEl.defaultMuted = true;
    videoEl.playsInline = true;
    videoEl.src = src;
    videoEl.load();
    if (!this.videoPaused()) {
      videoEl.play().catch(() => {
        // Mantiene estado silencioso si el navegador restringe autoplay
      });
    }
  }

  onVideoCanPlay(event: Event): void {
    const videoEl = event.target as HTMLVideoElement;
    videoEl.muted = true;
    videoEl.defaultMuted = true;
    if (!this.videoPaused() && videoEl.paused) {
      videoEl.play().catch(() => {});
    }
  }

  onVideoError(): void {
    const fallbackUrl = '/videos/cafeteria-pexels.mp4';
    if (this.videoSrc() !== fallbackUrl) {
      this.videoSrc.set(fallbackUrl);
      const videoEl = this.videoRef?.nativeElement;
      if (videoEl) {
        this.iniciarVideo(videoEl, fallbackUrl);
      }
    }
  }

  toggleVideoPlayback(): void {
    const video = this.videoRef?.nativeElement;
    if (!video) {
      return;
    }
    if (video.paused) {
      video.muted = true;
      video.play().catch(() => {});
      this.videoPaused.set(false);
    } else {
      video.pause();
      this.videoPaused.set(true);
    }
  }
}
