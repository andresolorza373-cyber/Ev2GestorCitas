
import { Component, EventEmitter, Input, Output } from '@angular/core';

import type { Quote } from '../../models/quote.model';

@Component({
  selector: 'app-quote-card',
  standalone: true,
  templateUrl: './quote-card.component.html',
  styleUrls: ['./quote-card.component.scss']
})
export class QuoteCardComponent {

  @Input({ required: true }) quote!: Quote;

  @Output() deleteQuote = new EventEmitter<number>();

  onDelete(): void {
    if (this.quote.id !== undefined) {
      this.deleteQuote.emit(this.quote.id);
    }
  }
}
