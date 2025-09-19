import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, DocItem } from '../../services/api.service';

@Component({
  selector: 'app-doc-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doc-list.component.html',
  styleUrls: ['./doc-list.component.css']
})
export class DocListComponent {
  private api = inject(ApiService);

  loading = signal(false);
  docs = signal<DocItem[]>([]);

  constructor() {
    this.refresh();
  }

  // PUBLIC_INTERFACE
  refresh() {
    /** Load document list from backend. */
    this.loading.set(true);
    this.api.getDocuments().subscribe({
      next: (documents) => { this.docs.set(documents ?? []); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }
}
