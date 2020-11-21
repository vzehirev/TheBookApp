import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { ModalService } from 'src/app/services/modal/modal.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private modalService: ModalService) { }

  addBookForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
    cover: ['', this.validateFileInput()]
  })

  ngOnInit(): void {
  }

  fileInputHandler(element: any) {
    this.addBookForm.controls.cover.setValue(element.files[0]?.name);
  }

  addBookFormSubmit() {
    if (this.addBookForm.invalid) {
      this.modalService.openModal("Please correctly fill in the fields and add a cover photo.")
    }
    console.log(this.addBookForm);
  }

  private validateFileInput(): ValidatorFn {
    return (formControl: AbstractControl): {} | null => {
      return formControl.value ? null : { required: true };
    }
  };
}