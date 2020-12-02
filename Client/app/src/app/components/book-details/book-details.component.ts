import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookDetailsModel } from 'src/app/models/books/book-details-model';
import { BooksService } from 'src/app/services/books/books.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent {
  book?: BookDetailsModel;

  constructor(private route: ActivatedRoute, private booksService: BooksService) {
    let bookId = this.route.snapshot.paramMap.get('id');
    this.booksService.getBookById(+bookId!).subscribe(b => this.book = b);
  }
}
