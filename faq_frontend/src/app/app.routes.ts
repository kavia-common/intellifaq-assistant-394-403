import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { FaqListComponent } from './components/faq-list/faq-list.component';
import { DocListComponent } from './components/doc-list/doc-list.component';

export const routes: Routes = [
  { path: '', component: ChatComponent, pathMatch: 'full' },
  { path: 'chat', component: ChatComponent },
  { path: 'faq', component: FaqListComponent },
  { path: 'docs', component: DocListComponent },
  { path: '**', redirectTo: '' },
];
