import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { IUserDetails } from 'src/app/interfaces/i-user-details';
import { LoginUserModel } from 'src/app/models/users/login-user-model';
import { UpdateUserModel } from 'src/app/models/users/update-user-model';
import { ModalService } from 'src/app/services/modal/modal.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {
  accDetailsForm!: FormGroup;
  userDetails!: IUserDetails;
  constructor(private formBuilder: FormBuilder, private modalService: ModalService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.usersService.getUserDetails().subscribe(res => { this.userDetails = res; this.initForm() });
  }

  accDetailsFormSubmit() {
    if (this.accDetailsForm.invalid) {
      this.modalService.openModal('Please correctly fill in the fields');
    } else {
      let inputModel = new UpdateUserModel(
        this.accDetailsForm.controls.currentPassword.value,
        this.accDetailsForm.controls.username.value,
        this.accDetailsForm.controls.email.value,
        this.accDetailsForm.controls.newPassword.value,
        this.accDetailsForm.controls.confirmNewPassword.value);

      this.usersService.updateUserAccount(inputModel).subscribe(() => {
        let loginUserModel = new LoginUserModel(this.accDetailsForm.controls.username.value,
          this.accDetailsForm.controls.newPassword.value ?? this.accDetailsForm.controls.currentPassword.value);

        this.usersService.loginUser(loginUserModel).subscribe(res => {
          this.usersService.persistSession(res);
          this.ngOnInit();
          this.modalService.openModal('Account successfully updated');
        });
      });
    }
  }

  private initForm() {
    this.accDetailsForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      username: [this.userDetails.username, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      email: [this.userDetails.email, [Validators.required, Validators.email]],
      newPassword: ['', [Validators.minLength(6), Validators.maxLength(50)]],
      confirmNewPassword: ['', this.confirmPasswordValidator()]
    });
  }

  private confirmPasswordValidator(): ValidatorFn {
    return (confirmNewPassword: AbstractControl): { passwordsDoNotMatch: boolean } | null => {
      return confirmNewPassword.value === this.accDetailsForm?.controls.newPassword.value ?
        null : { passwordsDoNotMatch: true }
    };
  };
}
