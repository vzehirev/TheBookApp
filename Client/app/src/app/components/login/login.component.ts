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
  forgottenPassword: boolean = false;

  loginForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
  });

  resetPasswordForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(private formBuilder: FormBuilder,
    private modalService: ModalService,
    private usersService: UsersService,
    private router: Router) { }

  loginFormSubmit(): void {
    if (this.loginForm.invalid) {
      this.modalService.openModal('Please correctly fill in the fields.');
    } else {
      let inputModel = new LoginUserModel(this.loginForm.controls.username.value, this.loginForm.controls.password.value);
      this.usersService.loginUser(inputModel).subscribe(res => this.usersService.persistSession(res));

      this.router.navigate(['/']);
    }
  }

  resetPasswordFormSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      this.modalService.openModal('Please correctly fill in your e-mail.');
    } else {
      this.usersService.resetPassword(this.resetPasswordForm.controls.email.value).subscribe(()=>this.modalService.openModal('New password was sent to your e-mail.'));
    }
  }
}
