import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import type { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonTextarea,
  IonTitle,
  IonToolbar
} from '@ionic/angular';

import { QuoteCardComponent } from '../../components/quote-card/quote-card.component';
import type { Quote } from '../../models/quote.model';
import { QuoteService } from '../../services/quote.service';

@Component({
  selector: 'app-quotes',
  standalone: true,
  templateUrl: './quotes.page.html',
  styleUrls: ['./quotes.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonTextarea,
    IonTitle,
    IonToolbar,
    QuoteCardComponent
  ]
})
export class QuotesPage implements OnInit {

  private readonly quoteService = inject(QuoteService);

  quotes: Quote[] = [];

  phrase = '';
  author = '';

  loading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    void this.loadQuotes();
  }

  async loadQuotes(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      this.quotes = await this.quoteService.getQuotes();
    } catch (error) {
      console.error('Error al cargar las citas:', error);
      this.errorMessage = 'No fue posible cargar las citas.';
    } finally {
      this.loading = false;
    }
  }

  async addQuote(): Promise<void> {
    const cleanPhrase = this.phrase.trim();
    const cleanAuthor = this.author.trim();

    this.errorMessage = '';
    this.successMessage = '';

    if (cleanPhrase.length < 5) {
      this.errorMessage = 'La cita debe tener al menos 5 caracteres.';
      return;
    }

    if (cleanAuthor.length < 2) {
      this.errorMessage = 'El autor debe tener al menos 2 caracteres.';
      return;
    }

    try {
      await this.quoteService.addQuote(cleanPhrase, cleanAuthor);

      this.phrase = '';
      this.author = '';

      await this.loadQuotes();

      this.successMessage = 'La cita se registró correctamente.';
    } catch (error) {
      console.error('Error al guardar la cita:', error);
      this.errorMessage = 'No fue posible guardar la cita.';
    }
  }

  async removeQuote(id: number): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.quoteService.deleteQuote(id);
      await this.loadQuotes();

      this.successMessage = 'La cita fue eliminada correctamente.';
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
      this.errorMessage = 'No fue posible eliminar la cita.';
    }
  }
}
