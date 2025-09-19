import { Injectable } from '@angular/core';
import { getEnv } from '../config/env';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/** Core types */
export interface FaqItem {
  id: string;
  question: string;
  answer?: string;
  tags?: string[];
  popularity?: number;
}
export interface DocItem {
  id: string;
  title: string;
  source?: string;
  summary?: string;
  updatedAt?: string;
}
export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: string;
}

/**
 * PUBLIC_INTERFACE
 * ApiService centralizes REST calls to the backend for FAQs, documents, and chat history.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = getEnv().API_BASE_URL;

  constructor(private http: HttpClient) {}

  // PUBLIC_INTERFACE
  getFaqs(): Observable<FaqItem[]> {
    /** Fetch list of FAQs. GET /faqs */
    return this.http.get<FaqItem[]>(`${this.base}/faqs`);
  }

  // PUBLIC_INTERFACE
  searchFaqs(q: string): Observable<FaqItem[]> {
    /** Search FAQs with query. GET /faqs?q=... */
    return this.http.get<FaqItem[]>(`${this.base}/faqs`, { params: { q } });
  }

  // PUBLIC_INTERFACE
  getDocuments(): Observable<DocItem[]> {
    /** Fetch documents. GET /documents */
    return this.http.get<DocItem[]>(`${this.base}/documents`);
  }

  // PUBLIC_INTERFACE
  getChatHistory(): Observable<ChatMessage[]> {
    /** Fetch chat history. GET /chat/history */
    return this.http.get<ChatMessage[]>(`${this.base}/chat/history`);
  }

  // PUBLIC_INTERFACE
  sendPrompt(prompt: string): Observable<ChatMessage> {
    /** Send a user prompt via REST. POST /chat/query */
    return this.http.post<ChatMessage>(`${this.base}/chat/query`, { prompt });
  }
}
