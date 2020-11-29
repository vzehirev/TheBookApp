import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endpoints } from 'src/app/endpoints';
import { IBook } from 'src/app/interfaces/i-book';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private httpClient: HttpClient) { }

  getAllBooks() {
    return this.httpClient.get<IBook[]>(Endpoints.AllBooks);
  }
}
