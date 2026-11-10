
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export interface AppSettings {
  darkMode: boolean;
  showAuthor: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  private readonly settingsKey = 'app_settings';

  private readonly defaultSettings: AppSettings = {
    darkMode: false,
    showAuthor: true
  };

  async loadSettings(): Promise<AppSettings> {
    const { value } = await Preferences.get({
      key: this.settingsKey
    });

    if (!value) {
      return { ...this.defaultSettings };
    }

    try {
      return {
        ...this.defaultSettings,
        ...JSON.parse(value)
      } as AppSettings;
    } catch {
      return { ...this.defaultSettings };
    }
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    await Preferences.set({
      key: this.settingsKey,
      value: JSON.stringify(settings)
    });
  }

  async updateSettings(
    changes: Partial<AppSettings>
  ): Promise<AppSettings> {
    const currentSettings = await this.loadSettings();

    const updatedSettings: AppSettings = {
      ...currentSettings,
      ...changes
    };

    await this.saveSettings(updatedSettings);

    return updatedSettings;
  }

  async resetSettings(): Promise<void> {
    await Preferences.remove({
      key: this.settingsKey
    });
  }
}
