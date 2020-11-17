import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/services/modal/modal.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private formBuilder: FormBuilder, private modalService: ModalService, private usersService: UsersService) { }

  forgottenPassword: boolean = false;

  loginForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
  });

  resetPasswordForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  });

  loginFormSubmit() {
    if (this.loginForm.invalid) {
      this.modalService.openModal('Please correctly fill in the fields.');
      return;
    }
    this.usersService.loginUser('usrn', 'pass');
  }

  resetPasswordFormSubmit() {
    if (this.resetPasswordForm.invalid) {
      this.modalService.openModal('Please correctly fill in your e-mail.');
      return;
    }
    this.usersService.resetPassword('email');
  }
}
