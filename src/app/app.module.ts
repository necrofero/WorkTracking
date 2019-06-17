import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule, MatInputModule, MatTableModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatDatepickerModule, MatNativeDateModule, MatCardModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NoAuthGuard } from './guards/noauth.guard';
import { AuthGuard } from './guards/auth.guard';
import { MainInterceptor } from './services/main.interceptor';
import { ConfigService } from './services/config.service';
import { UserService } from './services/user.service';
import { DataService } from './services/data.service';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MainInterceptor ,
      multi: true
    },
    MatDatepickerModule,
    NoAuthGuard,
    AuthGuard,
    ConfigService,
    UserService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
