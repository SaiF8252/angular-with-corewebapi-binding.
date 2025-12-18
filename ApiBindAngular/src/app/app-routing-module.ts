import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssueIndex } from './components/issue-index/issue-index';
import { IssueCreate } from './components/issue-create/issue-create';
import { IssueEdit } from './components/issue-edit/issue-edit';
import { IssueDetail } from './components/issue-detail/issue-detail';
import { LoginPage } from './components/login-page/login-page';
import { RegisterPage } from './components/register-page/register-page'; 
import { AppGuard } from '../app-guard';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'index', component: IssueIndex, canActivate: [AppGuard] },
  { path: 'create', component: IssueCreate, canActivate: [AppGuard] },
  { path: 'edit/:id', component: IssueEdit, canActivate: [AppGuard] },
  { path: 'details/:id', component: IssueDetail }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
