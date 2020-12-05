import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Endpoints } from 'src/app/endpoints';
import { IBook } from 'src/app/interfaces/i-book';
import { IVoteResponse } from 'src/app/interfaces/i-vote-response';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  constructor(private httpClient: HttpClient) { }

  getAllBooks() {
    return this.httpClient.get<IBook[]>(Endpoints.AllBooks);
  }

  getBookById(id: number) {
    return this.httpClient.get<IBook>(Endpoints.GetBook + `/${id}`);
  }

  getMyBooks(): Observable<IBook[]> {
    return this.httpClient.get<IBook[]>(Endpoints.MyBooks);
  }

  addBook(inputModel: FormData) {
    return this.httpClient.post(Endpoints.AddBook, inputModel);
  }

  deleteBook(id: number): Observable<IBook[]> {
    return this.httpClient.delete<IBook[]>(Endpoints.DeleteBook + `/${id}`);
  }

  updateBook(inputModel: FormData) {
    return this.httpClient.put(Endpoints.EditBook, inputModel);
  }

  upvote(bookId: number): Observable<IVoteResponse> {
    return this.httpClient.post<IVoteResponse>(Endpoints.VoteBook + `/${bookId}/true`, {});
  }

  downvote(bookId: number): Observable<IVoteResponse> {
    return this.httpClient.post<IVoteResponse>(Endpoints.VoteBook + `/${bookId}/false`, {});
  }
}
