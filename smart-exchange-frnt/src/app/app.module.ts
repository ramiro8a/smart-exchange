import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core'
import {MAT_MOMENT_DATE_FORMATS,MomentDateAdapter,MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';

import { MaterialModule } from './material.modules';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './utils/auth.interceptor';
import { CaculaCambioComponent } from './cacula-cambio/cacula-cambio.component';
import { LoginComponent } from './login/login.component';
import { RegistrateComponent } from './registrate/registrate.component';
import { RECAPTCHA_LANGUAGE, RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from "ng-recaptcha";
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { UsusariosCrudComponent } from './ususarios-crud/ususarios-crud.component';
import { ClienteComponent } from './cliente/cliente.component';
import { ReportesComponent } from './reportes/reportes.component';
import { OperacionesComponent } from './operaciones/operaciones.component';
import { UsuariosFormComponent } from './usuarios-form/usuarios-form.component';
import { PrincipalComponent } from './principal/principal.component';
import { ConfirmacionComponent } from './ui-utils/confirmacion/confirmacion.component';
import { ConfirmaComponent } from './confirma/confirma.component';
import { TipoCambioComponent } from './operaciones/tipo-cambio/tipo-cambio.component';
import { DatosPersonalesComponent } from './cliente/datos-personales/datos-personales.component';
import { CuentasBancariasComponent } from './cliente/cuentas-bancarias/cuentas-bancarias.component';
import { ListaCuentasBancariasComponent } from './cliente/lista-cuentas-bancarias/lista-cuentas-bancarias.component';
import { OperacionComponent } from './cliente/operacion/operacion.component';

const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'left',
			distance: 12
		},
		vertical: {
			position: 'top',
			distance: 12,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    AppComponent,
    CaculaCambioComponent,
    LoginComponent,
    RegistrateComponent,
    UsusariosCrudComponent,
    ClienteComponent,
    ReportesComponent,
    OperacionesComponent,
    UsuariosFormComponent,
    PrincipalComponent,
    ConfirmacionComponent,
    ConfirmaComponent,
    TipoCambioComponent,
    DatosPersonalesComponent,
    CuentasBancariasComponent,
    ListaCuentasBancariasComponent,
    OperacionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaV3Module,
    NotifierModule.withConfig(customNotifierOptions),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},{ 
    provide: RECAPTCHA_V3_SITE_KEY,
     useValue: "6Le4mg0pAAAAAM6m6mKlFc4Tcrlw_1rI4kSl0SM8"
    },
    {provide: MAT_DATE_LOCALE, useValue: 'es-bo'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: "es",
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
