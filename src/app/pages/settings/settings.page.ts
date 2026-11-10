
import { Component, inject } from '@angular/core';
import type { OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonTitle,
  IonToggle,
  IonToolbar
} from '@ionic/angular';

import type { AppSettings } from '../../services/preferences';
import { PreferencesService } from '../../services/preferences';

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  imports: [
    RouterLink,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonTitle,
    IonToggle,
    IonToolbar
  ]
})
export class SettingsPage implements OnInit {

  private readonly preferencesService = inject(PreferencesService);

  settings: AppSettings = {
    darkMode: false,
    showAuthor: true
  };

  loading = true;
  errorMessage = '';
  successMessage = '';

  async ngOnInit(): Promise<void> {
    await this.loadSettings();
  }

  async loadSettings(): Promise<void> {
    try {
      this.settings = await this.preferencesService.loadSettings();
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      this.errorMessage = 'No fue posible cargar la configuración.';
    } finally {
      this.loading = false;
    }
  }

  async updateDarkMode(event: unknown): Promise<void> {
    const checked = (event as CustomEvent<{ checked: boolean }>).detail.checked;

    try {
      this.settings = await this.preferencesService.updateSettings({
        darkMode: checked
      });

      this.successMessage = 'Configuración guardada correctamente.';
      this.errorMessage = '';
    } catch (error) {
      console.error('Error al guardar modo oscuro:', error);
      this.errorMessage = 'No fue posible guardar la configuración.';
    }
  }

  async updateShowAuthor(event: unknown): Promise<void> {
    const checked = (event as CustomEvent<{ checked: boolean }>).detail.checked;

    try {
      this.settings = await this.preferencesService.updateSettings({
        showAuthor: checked
      });

      this.successMessage = 'Configuración guardada correctamente.';
      this.errorMessage = '';
    } catch (error) {
      console.error('Error al guardar visualización del autor:', error);
      this.errorMessage = 'No fue posible guardar la configuración.';
    }
  }
}
