import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IBook } from 'src/app/interfaces/i-book';
import { IVoteResponse } from 'src/app/interfaces/i-vote-response';
import { AddReviewModel } from 'src/app/models/books/add-review';
import { BooksService } from 'src/app/services/books/books.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book?: IBook;
  addReviewForm!: FormGroup;
  constructor(private route: ActivatedRoute, private booksService: BooksService, private usersService: UsersService, private modalService: ModalService) { }

  ngOnInit() {
    let bookId = this.route.snapshot.paramMap.get('id');
    this.booksService.getBookById(+bookId!).subscribe(b => this.book = b);

    this.addReviewForm = new FormGroup({
      review: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(1000)])
    });
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

  addReview(): void {
    if (this.addReviewForm.invalid) {
      this.modalService.openModal('The review should be between 5 and 1000 characters long.');
    } else {
      let review = new AddReviewModel(this.book!.id, this.addReviewForm.controls.review.value);
      this.booksService.addReview(review).subscribe(res => this.book!.reviews.push(res));
    }
  }

  private updateRating(votes: IVoteResponse): void {
    this.book!.upvotes = votes.upvotes;
    this.book!.downvotes = votes.downvotes;
  }
}
