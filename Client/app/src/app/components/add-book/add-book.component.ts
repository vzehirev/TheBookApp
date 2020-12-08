import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BooksService } from 'src/app/services/books/books.service';
import { ModalService } from 'src/app/services/modal/modal.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent {
  constructor(private formBuilder: FormBuilder, private modalService: ModalService, private booksService: BooksService, private router: Router) { }

  private coverFile?: any;

  addBookForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
    year: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
    cover: ['', this.validateFileInput()]
  });

  addBookFormSubmit() {
    if (this.addBookForm.invalid) {
      this.modalService.openModal('Please correctly fill in all of the fields and add a cover photo.')
    } else {
      let formData = new FormData();
      formData.append('title', this.addBookForm.controls.title.value);
      formData.append('description', this.addBookForm.controls.description.value);
      formData.append('year', this.addBookForm.controls.year.value);
      formData.append('cover', this.coverFile);

      this.booksService.addBook(formData).subscribe(() => this.router.navigate(['/books']));
    }
  }

  fileInputHandler(fileInputEl: any) {
    this.coverFile = <File>fileInputEl.files[0];
    this.addBookForm.controls.cover.setValue(this.coverFile.name);
  }

  private validateFileInput(): ValidatorFn {
    return (formControl: AbstractControl): {} | null => {
      return formControl.value ? null : { required: true };
    }
  };
}