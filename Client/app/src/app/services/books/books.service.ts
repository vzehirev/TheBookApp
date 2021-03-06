import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Endpoints } from 'src/app/endpoints';
import { IBook } from 'src/app/interfaces/i-book';
import { IReview } from 'src/app/interfaces/i-review';
import { IVoteResponse } from 'src/app/interfaces/i-vote-response';
import { AddReviewModel } from 'src/app/models/books/add-review';
import { environment } from 'src/environments/environment';

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

  addReview(inputModel: AddReviewModel): Observable<IReview> {
    return this.httpClient.post<IReview>(Endpoints.Review, inputModel);
  }

  deleteReview(id: number): Observable<any> {
    return this.httpClient.delete(Endpoints.DeleteReview + `/${id}`);
  }
}
