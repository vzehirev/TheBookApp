import { Injectable } from '@angular/core';
import { Endpoints } from 'src/app/endpoints';
import { RegisterUserModel } from 'src/app/models/users/register-user-model';
import { HttpClient } from '@angular/common/http';
import { LoginUserModel } from 'src/app/models/users/login-user-model';
import { IJwtResponse } from 'src/app/interfaces/i-jwt-response';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient: HttpClient) { }

  registerUser(inputModel: RegisterUserModel) {
    return this.httpClient.post(Endpoints.Register, inputModel);
  }

  loginUser(inputModel: LoginUserModel) {
    return this.httpClient.post<IJwtResponse>(Endpoints.Login, inputModel)
      .subscribe(jwtResponse => this.persistSession(jwtResponse));
  }

  resetPassword(email: string) {
    console.log('Resetting password...');
  }

  private persistSession(jwtResponse: IJwtResponse) {
    let username = (JSON.parse(atob(jwtResponse.jwt.split('.')[1]))).username;

    localStorage.setItem('jwt', jwtResponse.jwt);
    localStorage.setItem('username', username);
  }

  isUserLoggedIn(): boolean {
    return localStorage.getItem('jwt') !== null && localStorage.getItem('username') !== null;
  }
}
