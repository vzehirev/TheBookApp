import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BooksComponent } from './components/books/books.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { BookCardComponent } from './components/book-card/book-card.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './components/modal/modal.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { AccountComponent } from './components/account/account.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { MyBooksComponent } from './components/my-books/my-books.component';
import { EditBookComponent } from './components/edit-book/edit-book.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth';
import { ErrorInterceptor } from './interceptors/error';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { LoadingSpinnerInterceptor } from './interceptors/loading';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    BooksComponent,
    NotFoundComponent,
    BookCardComponent,
    BookDetailsComponent,
    ModalComponent,
    AddBookComponent,
    AccountComponent,
    AccountDetailsComponent,
    MyBooksComponent,
    EditBookComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingSpinnerInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
