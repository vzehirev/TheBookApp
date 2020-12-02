import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginUserModel } from 'src/app/models/users/login-user-model';
import { ModalService } from 'src/app/services/modal/modal.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private formBuilder: FormBuilder,
    private modalService: ModalService,
    private usersService: UsersService,
    private router: Router) { }

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

    let inputModel = new LoginUserModel(this.loginForm.controls.username.value, this.loginForm.controls.password.value);
    this.usersService.loginUser(inputModel).subscribe(res => this.usersService.persistSession(res));

    this.router.navigate(['/']);
  }

  resetPasswordFormSubmit() {
    if (this.resetPasswordForm.invalid) {
      this.modalService.openModal('Please correctly fill in your e-mail.');
      return;
    }

    this.usersService.resetPassword(this.resetPasswordForm.controls.email.value);
  }
}
