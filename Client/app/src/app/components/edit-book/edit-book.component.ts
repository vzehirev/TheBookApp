import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { ModalService } from 'src/app/services/modal/modal.service';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private modalService: ModalService) { }

  @Output() toggleEditForm = new EventEmitter<boolean>();

  editBookForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
    newCover: ['', this.validateFileInput()]
  })

  ngOnInit(): void {
  }

  fileInputHandler(element: any) {
    this.editBookForm.controls.newCover.setValue(element.files[0]?.name);
  }

  editBookFormSubmit() {
    if (this.editBookForm.invalid) {
      this.modalService.openModal("Please correctly fill in the fields and add a cover photo.")
    }
    console.log(this.editBookForm);
  }

  private validateFileInput(): ValidatorFn {
    return (formControl: AbstractControl): {} | null => {
      return formControl.value ? null : { required: true };
    }
  };
}
