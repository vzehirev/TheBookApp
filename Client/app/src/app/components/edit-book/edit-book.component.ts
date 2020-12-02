import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { IBook } from 'src/app/interfaces/i-book';
import { BooksService } from 'src/app/services/books/books.service';
import { ModalService } from 'src/app/services/modal/modal.service';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private modalService: ModalService, private booksService: BooksService) { }

  @Output() toggleEditForm = new EventEmitter<boolean>();
  @Input() book?: IBook;
  editBookForm?: FormGroup;
  private newCover: any;

  ngOnInit(): void {
    this.editBookForm = this.formBuilder.group({
      title: [this.book?.title, Validators.required],
      description: [this.book?.description, [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      newCover: ['']
    })
  }

  fileInputHandler(element: any) {
    this.newCover = <File>element.files[0];
    this.editBookForm!.controls.newCover.setValue(this.newCover.name);
  }

  editBookFormSubmit() {
    if (this.editBookForm!.invalid) {
      this.modalService.openModal("Please correctly fill in the fields.")
    }

    let formData = new FormData();
    formData.append('id', this.book!.id.toString());
    formData.append('title', this.editBookForm!.controls.title.value);
    formData.append('description', this.editBookForm!.controls.description.value);
    if (this.newCover !== null) {
      formData.append('newCover', this.newCover);
    }

    this.booksService.updateBook(formData).subscribe(() => this.toggleEditForm.next(false));
  }
}
