import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuestionComponent } from './question/question.component';
import { QuestionService } from './question.service';
import { StudentsService } from './students.service';
import { TestconfigService } from './testconfig.service';
import { IntroComponent } from './intro/intro.component';
import { AppRoutingModule } from './/app-routing.module';
import { SignupComponent } from './signup/signup.component';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { Questionp2Component } from './questionp2/questionp2.component';
import { Questionp3Component } from './questionp3/questionp3.component';
import { Questionp4Component } from './questionp4/questionp4.component';
import { Editquestionp1Component } from './editquestionp1/editquestionp1.component';
import { Editquestionp2Component } from './editquestionp2/editquestionp2.component';
import { Editquestionp3Component } from './editquestionp3/editquestionp3.component';
import { OptionValidDirective } from './option-valid.directive';
import { Editquestionp4Component } from './editquestionp4/editquestionp4.component';
import { EditStudentComponent } from './edit-student/edit-student.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    QuizComponent,
    QuestionComponent,
    IntroComponent,
    SignupComponent,
    AdminpanelComponent,
    Questionp2Component,
    Questionp3Component,
    Questionp4Component,
    Editquestionp1Component,
    Editquestionp2Component,
    Editquestionp3Component,
    OptionValidDirective,
    Editquestionp4Component,
    EditStudentComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [QuestionService, StudentsService, TestconfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }
