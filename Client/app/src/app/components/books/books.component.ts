import { Component, OnInit } from '@angular/core';
import { IBook } from 'src/app/interfaces/i-book';
import { BooksService } from 'src/app/services/books/books.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  constructor(private booksService: BooksService) {
  }

  orders = [
    { name: 'NEWEST', value: 1 },
    { name: 'TOP RATED', value: 2 }
  ];
  books!: IBook[];
  selectedOrderBy: number = 1;

  ngOnInit(): void {
    this.booksService.getAllBooks().subscribe(res => this.books = res.sort((a, b) => { return b.year - a.year }));
  }

  orderBooks(): void {
    this.books.sort((a, b) => {
      if (this.selectedOrderBy == 1) {
        return b.year - a.year;
      } else if (this.selectedOrderBy == 2) {
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      } else {
        return b.year - a.year;
      }
    });
  }
}
