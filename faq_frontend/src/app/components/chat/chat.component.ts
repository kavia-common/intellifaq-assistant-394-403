import { Component, OnDestroy, OnInit, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { ApiService, ChatMessage } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  private chat = inject(ChatService);
  private api = inject(ApiService);

  input = '';
  status = signal<'disconnected'|'connecting'|'connected'|'error'>('disconnected');
  messages = signal<ChatMessage[]>([]);

  private subs: Subscription[] = [];

  ngOnInit(): void {
    this.subs.push(
      this.chat.status().subscribe(s => this.status.set(s)),
      this.chat.stream().subscribe(m => this.messages.set(m))
    );
    this.subs.push(
      this.api.getChatHistory().subscribe({
        next: hist => {
          if (hist?.length) {
            this.messages.set(hist);
          }
        },
        error: () => {}
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  // PUBLIC_INTERFACE
  send(): void {
    /** Send message via ChatService. */
    const content = this.input.trim();
    if (!content) return;
    this.chat.sendMessage(content);
    this.input = '';
  }
}
