import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  type SQLiteDBConnection
} from '@capacitor-community/sqlite';

import type { Quote } from '../models/quote.model';

@Injectable({
  providedIn: 'root'
})
export class Sqlite {

  private readonly databaseName = 'gestor_citas';
  private readonly sqlite = new SQLiteConnection(CapacitorSQLite);

  private db: SQLiteDBConnection | null = null;
  private initialization: Promise<void> | null = null;

  async initializeDatabase(): Promise<void> {
    if (this.db) {
      return;
    }

    if (!this.initialization) {
      this.initialization = this.setupDatabase();
    }

    try {
      await this.initialization;
    } catch (error) {
      this.initialization = null;
      throw error;
    }
  }

  private async setupDatabase(): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      await this.sqlite.initWebStore();
    }

    const connectionExists = await this.sqlite.isConnection(
      this.databaseName,
      false
    );

    if (connectionExists.result) {
      this.db = await this.sqlite.retrieveConnection(
        this.databaseName,
        false
      );
    } else {
      this.db = await this.sqlite.createConnection(
        this.databaseName,
        false,
        'no-encryption',
        1,
        false
      );
    }

    await this.db.open();

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phrase TEXT NOT NULL,
        author TEXT NOT NULL
      );
    `);

    await this.saveWebStore();
  }

  private async saveWebStore(): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      await this.sqlite.saveToStore(this.databaseName);
    }
  }

  async getQuotes(): Promise<Quote[]> {
    await this.initializeDatabase();

    const result = await this.db!.query(
      'SELECT id, phrase, author FROM quotes ORDER BY id DESC'
    );

    return (result.values ?? []) as Quote[];
  }

  async addQuote(phrase: string, author: string): Promise<void> {
    await this.initializeDatabase();

    await this.db!.run(
      'INSERT INTO quotes (phrase, author) VALUES (?, ?)',
      [phrase, author]
    );

    await this.saveWebStore();
  }

  async deleteQuote(id: number): Promise<void> {
    await this.initializeDatabase();

    await this.db!.run(
      'DELETE FROM quotes WHERE id = ?',
      [id]
    );

    await this.saveWebStore();
  }
}