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

  loginUser(inputModel: LoginUserModel): void {
    this.httpClient.post<IJwtResponse>(Endpoints.Login, inputModel)
      .subscribe(jwtResponse => this.persistSession(jwtResponse));
  }

  refreshJwt(): void {
    this.httpClient.post<IJwtResponse>(Endpoints.RefreshJwt, {})
      .subscribe(jwtResponse => this.persistSession(jwtResponse));
  }

  resetPassword(email: string): void {
    console.log('Resetting password...');
  }

  private persistSession(jwtResponse: IJwtResponse): void {
    let username = (JSON.parse(atob(jwtResponse.jwt.split('.')[1]))).username;

    localStorage.setItem('jwt', jwtResponse.jwt);
    localStorage.setItem('username', username);
  }

  get isUserLoggedIn(): boolean {
    return localStorage.getItem('jwt') !== null && localStorage.getItem('username') !== null;
  }

  get username(): string | null {
    return localStorage.getItem('username');
  }

  logoutUser(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
  }

  get isJwtExpired(): boolean {
    if (this.isUserLoggedIn) {
      let jwt = localStorage.getItem('jwt') ?? '';
      let jwtExpiry = (JSON.parse(atob(jwt.split('.')[1]))).exp;
      let nowPlusOneMinute = (Math.floor(((new Date).getTime() + 1 * 60000) / 1000));

      return nowPlusOneMinute >= jwtExpiry;
    }
    return true;
  }
}
