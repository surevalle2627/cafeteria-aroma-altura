import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { NosotrosInfo } from '../../models/cafeteria.models';
import { CafeteriaService } from '../../services/cafeteria.service';

interface NavLinkItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly cafeteriaService = inject(CafeteriaService);

  @ViewChild('headerEl') headerEl?: ElementRef<HTMLElement>;
  @ViewChild('headerInner') headerInner?: ElementRef<HTMLElement>;
  @ViewChild('siteMenu') siteMenu?: ElementRef<HTMLUListElement>;
  @ViewChild('menuBtn') menuBtn?: ElementRef<HTMLButtonElement>;

  readonly links: NavLinkItem[] = [
    { label: 'Inicio', path: '/inicio' },
    { label: 'Servicios', path: '/servicios' },
    { label: 'Especialidades', path: '/especialidades' },
    { label: 'Nosotros', path: '/nosotros' },
    { label: 'Precios', path: '/precios' },
    { label: 'Contactos', path: '/contactos' },
  ];

  readonly nosotros = signal<NosotrosInfo | null>(null);
  readonly isScrolled = signal(false);
  readonly currentUrl = signal(this.router.url);
  readonly isWide = signal(true);
  readonly isMeasuring = signal(false);
  readonly menuOpen = signal(false);
  readonly menuOpenFallback = signal(false);

  readonly isInicioRoute = computed(() => {
    const url = this.currentUrl();
    return url === '/' || url.startsWith('/inicio');
  });

  readonly brandName = computed(() => this.nosotros()?.nombre_cafeteria ?? '');

  private readonly supportsPopover =
    typeof HTMLElement !== 'undefined' && Object.hasOwn(HTMLElement.prototype, 'popover');

  private resizeObserver?: ResizeObserver;
  private lastCollapsedWidth = 0;
  private subs = new Subscription();

  private readonly onScroll = () => {
    this.isScrolled.set(window.scrollY > 28);
  };

  ngOnInit(): void {
    this.subs.add(
      this.cafeteriaService.getNosotros().subscribe({
        next: (res) => {
          this.nosotros.set(res.nosotros);
          requestAnimationFrame(() => this.measureLayout());
        },
        error: () => {
          // Mantiene estado silencioso si el servidor no responde todavía
        },
      })
    );

    this.subs.add(
      this.router.events
        .pipe(filter((ev): ev is NavigationEnd => ev instanceof NavigationEnd))
        .subscribe((ev) => {
          this.currentUrl.set(ev.urlAfterRedirects);
          this.closeMobileMenu();
        })
    );

    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.onScroll();
  }

  ngAfterViewInit(): void {
    this.measureLayout();

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver((entries) => {
        const headerEntry = entries.find((e) => e.target === this.headerEl?.nativeElement);
        const currentWidth = headerEntry?.contentRect.width ?? this.headerEl?.nativeElement.clientWidth ?? 0;

        if (!this.isWide() && currentWidth <= this.lastCollapsedWidth) {
          return;
        }
        this.measureLayout();
      });

      if (this.headerEl?.nativeElement) {
        this.resizeObserver.observe(this.headerEl.nativeElement);
      }
      if (this.siteMenu?.nativeElement) {
        this.resizeObserver.observe(this.siteMenu.nativeElement);
      }
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
    this.resizeObserver?.disconnect();
    this.subs.unsubscribe();
  }

  private measureLayout(): void {
    const header = this.headerEl?.nativeElement;
    const inner = this.headerInner?.nativeElement;
    const menu = this.siteMenu?.nativeElement;
    if (!header || !inner || !menu) {
      return;
    }

    const wasOpen = this.menuOpen();
    this.isMeasuring.set(true);
    header.classList.add('is-measuring', 'is-wide');
    menu.removeAttribute('popover');

    const fits = inner.scrollWidth <= inner.clientWidth + 1;

    this.isWide.set(fits);
    header.classList.toggle('is-wide', fits);

    if (fits) {
      menu.removeAttribute('popover');
      this.menuOpen.set(false);
      this.menuOpenFallback.set(false);
    } else {
      this.lastCollapsedWidth = header.clientWidth || window.innerWidth;
      if (this.supportsPopover) {
        menu.setAttribute('popover', 'auto');
        if (wasOpen && !menu.matches(':popover-open')) {
          try {
            menu.showPopover();
          } catch {
            // Ignora si el elemento aún no está visible en el top layer
          }
        }
      }
    }

    requestAnimationFrame(() => {
      header.classList.remove('is-measuring');
      this.isMeasuring.set(false);
    });
  }

  onPopoverToggle(event: Event): void {
    const toggleEv = event as ToggleEvent;
    this.menuOpen.set(toggleEv.newState === 'open');
  }

  onFallbackToggle(): void {
    if (this.supportsPopover || this.isWide()) {
      return;
    }
    const next = !this.menuOpenFallback();
    this.menuOpenFallback.set(next);
    this.menuOpen.set(next);
  }

  closeMobileMenu(): void {
    const menu = this.siteMenu?.nativeElement;
    if (this.supportsPopover && menu?.matches(':popover-open')) {
      try {
        menu.hidePopover();
      } catch {
        // noop
      }
    }
    this.menuOpenFallback.set(false);
    this.menuOpen.set(false);
  }
}
