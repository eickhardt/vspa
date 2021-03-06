import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/*
 * Platform and Environment providers/directives/pipes
 */
import { environment } from 'environments/environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';

import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FieldsetModule } from 'primeng/fieldset';
import { MenubarModule } from 'primeng/menubar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { CardImageComponent } from './components/card/card-image.component';
import { SupplyPileComponent } from './components/supplyPile/supply-pile.component';
import { ChartComponent } from './components/chart/chart.component';
import { IllusoryCardComponent } from './components/illusoryCard/illusory-card.component';

import { GameService } from './services/gameService/game.service';
import { CardStateService } from './services/cardStateService/cardStateService';

import '../styles/styles.scss';
import '../styles/headings.css';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState,
  MessageService,
  ConfirmationService,
  GameService,
  CardStateService,
];

const PRIMENG_MODULES = [
  AccordionModule,
  RadioButtonModule,
  TooltipModule,
  PanelModule,
  ToastModule,
  ButtonModule,
  FieldsetModule,
  MenubarModule,
  ConfirmDialogModule,
  DialogModule,
  NgxChartsModule,
  OverlayPanelModule,
];

const COMPONENTS = [
  CardImageComponent,
  SupplyPileComponent,
  IllusoryCardComponent,
  ChartComponent,
];

interface StoreType {
  state: InternalStateType;
  restoreInputValues: () => void;
  disposeOldHosts: () => void;
}

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    ...COMPONENTS,
  ],
  /**
   * Import Angular's modules.
   */
  imports: [
    ...PRIMENG_MODULES,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, {
      useHash: Boolean(history.pushState) === false,
      preloadingStrategy: PreloadAllModules,
    }),

    /**
     * This section will import the `DevModuleModule` only in certain build types.
     * When the module is not imported it will get tree shaked.
     * This is a simple example, a big app should probably implement some logic
     */
    // ...environment.showDevModule ? [ DevModuleModule ] : [],
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    environment.ENV_PROVIDERS,
    APP_PROVIDERS,
  ],
})
export class AppModule {}
