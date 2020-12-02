import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { AddBookModel } from 'src/app/models/books/add-book-model';
import { BooksService } from 'src/app/services/books/books.service';
import { ModalService } from 'src/app/services/modal/modal.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  private coverFile?: any;

  constructor(private formBuilder: FormBuilder, private modalService: ModalService, private booksService: BooksService) { }

  addBookForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
    cover: ['', this.validateFileInput()]
  })

  ngOnInit(): void {
  }

  fileInputHandler(fileInputEl: any) {
    this.coverFile = <File>fileInputEl.files[0];
    this.addBookForm.controls.cover.setValue(this.coverFile.name);
  }

  addBookFormSubmit() {
    if (this.addBookForm.invalid) {
      this.modalService.openModal("Please correctly fill in the fields and add a cover photo.")
    }

    let formData = new FormData();
    formData.append('title', this.addBookForm.controls.title.value);
    formData.append('description', this.addBookForm.controls.description.value);
    formData.append('cover', this.coverFile);
    
    this.booksService.addBook(formData).subscribe(x => console.log(x));
  }

  private validateFileInput(): ValidatorFn {
    return (formControl: AbstractControl): {} | null => {
      return formControl.value ? null : { required: true };
    }
  };
}