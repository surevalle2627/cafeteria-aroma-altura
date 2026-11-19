import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatMessage, NosotrosInfo } from '../../models/cafeteria.models';
import { CafeteriaService } from '../../services/cafeteria.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
})
export class ChatbotComponent implements OnInit, OnDestroy {
  private readonly cafeteriaService = inject(CafeteriaService);

  @ViewChild('messagesViewport') messagesViewport?: ElementRef<HTMLDivElement>;
  @ViewChild('chatInput') chatInput?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('launcherBtn') launcherBtn?: ElementRef<HTMLButtonElement>;

  readonly isOpen = signal(false);
  readonly isTyping = signal(false);
  readonly nosotros = signal<NosotrosInfo | null>(null);
  readonly messages = signal<ChatMessage[]>([]);
  draftMessage = '';

  readonly quickPrompts = [
    '¿Qué especialidades tienen hoy?',
    '¿Cuál es su horario de atención?',
    '¿Dónde están ubicados?',
  ];

  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.cafeteriaService.getNosotros().subscribe({
      next: (res) => {
        this.nosotros.set(res.nosotros);
        this.initGreeting(res.nosotros?.nombre_cafeteria || 'Aroma & Altura');
      },
      error: () => {
        this.initGreeting('Aroma & Altura');
      },
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen()) {
      this.closeChat();
    }
  }

  private initGreeting(nombreCafeteria: string): void {
    if (this.messages().length > 0) {
      return;
    }
    this.messages.set([
      {
        id: 'welcome-1',
        autor: 'barista',
        texto: `¡Hola! Soy el barista virtual de ${nombreCafeteria}. ¿En qué puedo orientarte hoy? Puedo recomendarte cafés de especialidad, métodos de filtrado, precios, servicios u horarios.`,
        hora: this.formatHour(),
      },
    ]);
  }

  toggleChat(): void {
    if (this.isOpen()) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat(): void {
    this.isOpen.set(true);
    setTimeout(() => {
      this.chatInput?.nativeElement.focus();
      this.scrollToBottom();
    }, 60);
  }

  closeChat(): void {
    this.isOpen.set(false);
    setTimeout(() => {
      this.launcherBtn?.nativeElement.focus();
    }, 30);
  }

  onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (event.isComposing || event.keyCode === 229) {
        return;
      }
      this.sendMessage();
    }
  }

  sendQuickPrompt(prompt: string): void {
    this.draftMessage = prompt;
    this.sendMessage();
  }

  sendMessage(): void {
    const texto = this.draftMessage.trim();
    if (!texto || this.isTyping()) {
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      autor: 'usuario',
      texto,
      hora: this.formatHour(),
    };

    this.messages.update((prev) => [...prev, userMsg]);
    this.draftMessage = '';
    this.isTyping.set(true);
    this.scrollToBottom();

    this.cafeteriaService.enviarMensajeChatbot(texto).subscribe({
      next: (res) => {
        const reply: ChatMessage = {
          id: `bot-${Date.now()}`,
          autor: 'barista',
          texto: res.respuesta,
          hora: this.formatHour(),
        };
        this.messages.update((prev) => [...prev, reply]);
        this.isTyping.set(false);
        this.scrollToBottom();
      },
      error: () => {
        const errorMsg: ChatMessage = {
          id: `bot-err-${Date.now()}`,
          autor: 'barista',
          texto:
            'No pude comunicarme con el servidor del barista en este momento. Verifica que el backend esté activo en el puerto 3000.',
          hora: this.formatHour(),
        };
        this.messages.update((prev) => [...prev, errorMsg]);
        this.isTyping.set(false);
        this.scrollToBottom();
      },
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.messagesViewport?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 30);
  }

  private formatHour(): string {
    return new Date().toLocaleTimeString('es-BO', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
