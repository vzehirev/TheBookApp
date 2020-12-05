import { Component, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { IBook } from 'src/app/interfaces/i-book';
import { BooksService } from 'src/app/services/books/books.service';

@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.css']
})
export class MyBooksComponent implements OnInit {
  showEdit: boolean = false;
  @Output() bookForEdit?: IBook;
  myBooks!: IBook[];

  constructor(private booksService: BooksService) {
  }

  ngOnInit(): void {
    this.booksService.getMyBooks().subscribe(res => this.myBooks = res);
  }

  editBook(id: number) {
    this.showEdit = true;
    this.bookForEdit = this.myBooks.find(b => b.id === id);
  }

  showEditForm(event: any) {
    this.showEdit = event;
    this.booksService.getMyBooks().subscribe(res => this.myBooks = res);
  }

  deleteBook(id: number): void {
    if (confirm('Confirm book deletion?')) {
      this.booksService.deleteBook(id).subscribe(() => this.myBooks = this.myBooks.filter(b => b.id !== id));
    }
  }
}
