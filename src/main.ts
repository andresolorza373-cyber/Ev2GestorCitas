import { bootstrapApplication } from '@angular/platform-browser';
import {
  PreloadAllModules,
  provideRouter,
  RouteReuseStrategy,
  withComponentInputBinding,
  withPreloading
} from '@angular/router';
import { Capacitor } from '@capacitor/core';
import {
  IonicRouteStrategy,
  provideIonicAngular
} from '@ionic/angular';
import { defineCustomElements } from 'jeep-sqlite/loader';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

async function startApp(): Promise<void> {
  if (Capacitor.getPlatform() === 'web') {
    defineCustomElements(window);

    await customElements.whenDefined('jeep-sqlite');

    if (!document.querySelector('jeep-sqlite')) {
      const jeepSqliteElement = document.createElement('jeep-sqlite');
      document.body.appendChild(jeepSqliteElement);
    }
  }

  await bootstrapApplication(AppComponent, {
    providers: [
      {
        provide: RouteReuseStrategy,
        useClass: IonicRouteStrategy
      },
      provideIonicAngular(),
      provideRouter(
        routes,
        withPreloading(PreloadAllModules),
        withComponentInputBinding()
      )
    ]
  });
}

startApp().catch((error: unknown) => {
  console.error('Error al iniciar la aplicación:', error);
});