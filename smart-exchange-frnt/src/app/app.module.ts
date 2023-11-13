import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.modules';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { CaculaCambioComponent } from './cacula-cambio/cacula-cambio.component';
import { LoginComponent } from './login/login.component';
import { RegistrateComponent } from './registrate/registrate.component';
import { LogoComponent } from './logo/logo.component';
import { RECAPTCHA_LANGUAGE, RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from "ng-recaptcha";

@NgModule({
  declarations: [
    AppComponent,
    CaculaCambioComponent,
    LoginComponent,
    RegistrateComponent,
    LogoComponent
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
  ],
  providers: [{ 
    provide: RECAPTCHA_V3_SITE_KEY,
     useValue: "6Le4mg0pAAAAAM6m6mKlFc4Tcrlw_1rI4kSl0SM8"
    },
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: "es",
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
