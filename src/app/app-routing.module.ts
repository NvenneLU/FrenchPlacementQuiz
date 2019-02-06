import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IntroComponent } from './intro/intro.component';
import { SignupComponent } from './signup/signup.component';
import { QuizComponent } from './quiz/quiz.component';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';

const routes: Routes = [
  { path: '', redirectTo: '/intro', pathMatch: 'full' },
  { path: 'intro', component: IntroComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'quiz/:encodedID', component: QuizComponent},
  { path: 'admin', component: AdminpanelComponent},
  { path: 'quiz', redirectTo: '/signup'},
  { path: '**', redirectTo: '/intro'}
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
