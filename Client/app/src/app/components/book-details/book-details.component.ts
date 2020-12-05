import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IBook } from 'src/app/interfaces/i-book';
import { IVoteResponse } from 'src/app/interfaces/i-vote-response';
import { BooksService } from 'src/app/services/books/books.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  constructor(private route: ActivatedRoute, private booksService: BooksService, private usersService: UsersService, private modalService: ModalService) { }

  book?: IBook;

  ngOnInit() {
    let bookId = this.route.snapshot.paramMap.get('id');
    this.booksService.getBookById(+bookId!).subscribe(b => this.book = b);
  }

  upvote(): void {
    if (!this.usersService.isUserLoggedIn) {
      this.modalService.openModal('Only logged users can rate books.');
    } else {
      this.booksService.upvote(this.book!.id).subscribe(res => this.updateRating(res));
    }
  }

  downvote(): void {
    if (!this.usersService.isUserLoggedIn) {
      this.modalService.openModal('Only logged users can rate books.');
    } else {
      this.booksService.downvote(this.book!.id).subscribe(res => this.updateRating(res));
    }
  }

  private updateRating(votes: IVoteResponse): void {
    this.book!.upvotes = votes.upvotes;
    this.book!.downvotes = votes.downvotes;
  }
}
