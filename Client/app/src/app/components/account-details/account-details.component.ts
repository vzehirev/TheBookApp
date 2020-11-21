import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { ModalService } from 'src/app/services/modal/modal.service';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private modalService: ModalService) { }

  ngOnInit(): void {
  }

  accDetailsForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    confirmNewPassword: ['', [Validators.required, this.confirmPasswordValidator()]]
  });

  accDetailsFormSubmit() {
    console.log(this.accDetailsForm)
    if (this.accDetailsForm.invalid) {
      this.modalService.openModal('Please correctly fill in the fields');
    }
  }

  private confirmPasswordValidator(): ValidatorFn {
    return (confirmNewPassword: AbstractControl): { passwordsDoNotMatch: boolean } | null => {
      return confirmNewPassword.value === this.accDetailsForm?.controls.newPassword.value ?
        null : { passwordsDoNotMatch: true }
    };
  };
}
