import { inject, Injectable } from '@angular/core';

import type { Quote } from '../models/quote.model';

import { Sqlite } from './sqlite';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  private readonly sqlite = inject(Sqlite);

  async getQuotes(): Promise<Quote[]> {
    return this.sqlite.getQuotes();
  }

  async addQuote(
    phrase: string,
    author: string
  ): Promise<void> {
    const cleanPhrase = phrase.trim();
    const cleanAuthor = author.trim();

    if (cleanPhrase.length < 5) {
      throw new Error('La cita debe tener al menos 5 caracteres.');
    }

    if (cleanAuthor.length < 2) {
      throw new Error('El autor debe tener al menos 2 caracteres.');
    }

    await this.sqlite.addQuote(cleanPhrase, cleanAuthor);
  }

  async deleteQuote(id: number): Promise<void> {
    await this.sqlite.deleteQuote(id);
  }

  async getRandomQuote(): Promise<Quote | undefined> {
    const quotes = await this.getQuotes();

    if (quotes.length === 0) {
      return undefined;
    }

    const index = Math.floor(Math.random() * quotes.length);

    return quotes[index];
  }
}