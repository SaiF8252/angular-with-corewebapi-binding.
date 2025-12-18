import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { IssueCreate } from './components/issue-create/issue-create';
import { IssueIndex } from './components/issue-index/issue-index';
import { IssueEdit } from './components/issue-edit/issue-edit';
import { LoginPage } from './components/login-page/login-page';
import { RegisterPage } from './components/register-page/register-page';
import { TokenInterceptor } from './services/token-interceptor';
import { IssueDetail } from './components/issue-detail/issue-detail'; // 🔹 import your interceptor

@NgModule({
  declarations: [
    App,
    IssueCreate,
    IssueIndex,
    IssueEdit,
    LoginPage,
    RegisterPage,
    IssueDetail
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,  // 🔹 attach interceptor
      multi: true
    }
  ],
  bootstrap: [App]
})
export class AppModule { }
