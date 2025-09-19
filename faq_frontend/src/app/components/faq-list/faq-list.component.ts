import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, FaqItem } from '../../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-faq-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.css']
})
export class FaqListComponent {
  private api = inject(ApiService);

  @Output() ask = new EventEmitter<string>();

  q = '';
  loading = signal(false);
  items = signal<FaqItem[]>([]);

  constructor() {
    this.fetch();
  }

  // PUBLIC_INTERFACE
  fetch() {
    /** Load FAQs initially. */
    this.loading.set(true);
    this.api.getFaqs().subscribe({
      next: (faqs) => { this.items.set(faqs ?? []); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  // PUBLIC_INTERFACE
  search() {
    /** Search FAQs by query, fallback to getFaqs if empty. */
    const query = this.q.trim();
    if (!query) return this.fetch();
    this.loading.set(true);
    this.api.searchFaqs(query).subscribe({
      next: (faqs) => { this.items.set(faqs ?? []); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  // PUBLIC_INTERFACE
  askQuestion(item: FaqItem) {
    /** Emit selected FAQ question to parent. */
    this.ask.emit(item.question);
  }
}
