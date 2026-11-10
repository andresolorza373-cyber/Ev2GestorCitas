
import { Component, inject } from '@angular/core';
import type { OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/angular';

import type { Quote } from '../../models/quote.model';
import { QuoteService } from '../../services/quote.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    RouterLink
  ]
})
export class HomePage implements OnInit {

  private readonly quoteService = inject(QuoteService);

  randomQuote: Quote | undefined;

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    void this.loadRandomQuote();
  }

  async loadRandomQuote(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      this.randomQuote = await this.quoteService.getRandomQuote();
    } catch (error) {
      console.error('Error al obtener una cita aleatoria:', error);
      this.errorMessage = 'No fue posible cargar una cita.';
    } finally {
      this.loading = false;
    }
  }
}
