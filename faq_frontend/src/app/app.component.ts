import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { FaqListComponent } from './components/faq-list/faq-list.component';
import { DocListComponent } from './components/doc-list/doc-list.component';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, ChatComponent, FaqListComponent, DocListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  year = new Date().getFullYear();
  private chat = inject(ChatService);

  // PUBLIC_INTERFACE
  handleAsk(question: string) {
    /** Ask a question from FAQ list directly into the chat stream. */
    this.chat.sendMessage(question);
  }
}
