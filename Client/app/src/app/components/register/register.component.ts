import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ModalService } from 'src/app/services/modal/modal.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent{

  constructor(private formBuilder: FormBuilder, private modalService: ModalService, private usersService: UsersService) { }

  registerForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    confirmPassword: ['', [Validators.required, this.confirmPasswordValidator()]]
  });

  registerFormSubmit() {
    if (this.registerForm.invalid) {
      this.modalService.openModal('Please correctly fill in the fields.');
      return;
    }
    this.usersService.registerUser('usrn', 'mail', 'pass', 'cpass');
  }

  private confirmPasswordValidator(): ValidatorFn {
    return (confirmPassword: AbstractControl): { passwordsDoNotMatch: boolean } | null => {
      return confirmPassword.value === this.registerForm?.controls.password.value ?
        null : { passwordsDoNotMatch: true }
    };
  };
}