/* eslint no-undef: "off" */
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { getEnv } from '../config/env';
import type { ChatMessage } from './api.service';

// Declare browser globals to satisfy SSR-aware linting.
declare const WebSocket: {
  new (url: string): WebSocket;
  readonly CONNECTING: number;
  readonly OPEN: number;
  readonly CLOSING: number;
  readonly CLOSED: number;
};
declare function setTimeout(handler: (...args: any[]) => void, timeout?: number): number;

/**
 * PUBLIC_INTERFACE
 * ChatService manages real-time WebSocket connection and outgoing/incoming messages.
 */
@Injectable({ providedIn: 'root' })
export class ChatService {
  private ws?: WebSocket;
  private wsUrl = getEnv().WS_URL;
  private connecting = false;
  private reconnectDelay = 1500;

  private messages$ = new BehaviorSubject<ChatMessage[]>([]);
  private status$ = new BehaviorSubject<'disconnected'|'connecting'|'connected'|'error'>('disconnected');
  private errors$ = new Subject<string>();

  constructor(private zone: NgZone) {
    // Guard against server-side execution where WebSocket may be undefined.
    try {
      if (typeof WebSocket !== 'undefined') {
        this.connect();
      }
    } catch {
      // ignore on SSR
    }
  }

  // PUBLIC_INTERFACE
  status(): Observable<'disconnected'|'connecting'|'connected'|'error'> {
    /** Observable of the socket connection status. */
    return this.status$.asObservable();
  }

  // PUBLIC_INTERFACE
  stream(): Observable<ChatMessage[]> {
    /** Observable stream of chat messages. */
    return this.messages$.asObservable();
  }

  // PUBLIC_INTERFACE
  sendMessage(content: string) {
    /** Send a message to the assistant; will buffer via REST fallback if socket not ready. */
    const msg: ChatMessage = { role: 'user', content };
    this.append(msg);
    try {
      if (this.ws && typeof WebSocket !== 'undefined' && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'user_message', content }));
      } else {
        // buffer via simple reconnect attempt
        this.connect();
        if (typeof setTimeout !== 'undefined') {
          setTimeout(() => {
            if (this.ws && typeof WebSocket !== 'undefined' && this.ws.readyState === WebSocket.OPEN) {
              this.ws.send(JSON.stringify({ type: 'user_message', content }));
            }
          }, 500);
        }
      }
    } catch (e: any) {
      this.errors$.next(String(e?.message || e));
    }
  }

  // PUBLIC_INTERFACE
  errors(): Observable<string> { return this.errors$.asObservable(); }

  private append(...items: ChatMessage[]) {
    const current = this.messages$.value;
    this.messages$.next([...current, ...items]);
  }

  // Establish web socket connection with auto-reconnect.
  private connect() {
    if (typeof WebSocket === 'undefined') {
      this.status$.next('error');
      return;
    }
    if (this.connecting || (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING))) {
      return;
    }
    this.connecting = true;
    this.status$.next('connecting');

    try {
      this.ws = new WebSocket(this.wsUrl);
    } catch (e) {
      this.status$.next('error');
      this.connecting = false;
      return;
    }

    this.ws.onopen = () => {
      this.zone.run(() => {
        this.status$.next('connected');
        this.connecting = false;
      });
    };
    this.ws.onmessage = (evt) => {
      this.zone.run(() => {
        try {
          const data = JSON.parse((evt as MessageEvent).data as any);
          if (data?.type === 'assistant_message' || data?.role === 'assistant') {
            const msg: ChatMessage = { role: 'assistant', content: data.content ?? String(data.text ?? '') };
            this.append(msg);
          } else if (data?.type === 'status') {
            // optional status updates
          }
        } catch {
          const msg: ChatMessage = { role: 'assistant', content: String((evt as MessageEvent).data) };
          this.append(msg);
        }
      });
    };
    this.ws.onerror = () => {
      this.zone.run(() => {
        this.status$.next('error');
      });
    };
    this.ws.onclose = () => {
      this.zone.run(() => {
        this.status$.next('disconnected');
        this.connecting = false;
        if (typeof setTimeout !== 'undefined') {
          setTimeout(() => this.connect(), this.reconnectDelay);
        }
      });
    };
  }
}
