import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBook } from 'src/app/interfaces/i-book';
import { BooksService } from 'src/app/services/books/books.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  books: Observable<IBook[]>;
  
  constructor(private booksService: BooksService) {
    this.books = this.booksService.getAllBooks();
  }

  ngOnInit(): void {
  }
}
