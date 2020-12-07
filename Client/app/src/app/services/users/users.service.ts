import { Injectable } from '@angular/core';
import { Endpoints } from 'src/app/endpoints';
import { HttpClient } from '@angular/common/http';
import { LoginUserModel } from 'src/app/models/users/login-user-model';
import { IJwtResponse } from 'src/app/interfaces/i-jwt-response';
import { Observable } from 'rxjs';
import { IUserDetails } from 'src/app/interfaces/i-user-details';
import { UpdateUserModel } from 'src/app/models/users/update-user-model';
import { RegisterUserModel } from 'src/app/models/users/register-user-model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private httpClient: HttpClient) { }

  registerUser(inputModel: RegisterUserModel) {
    return this.httpClient.post(Endpoints.Register, inputModel);
  }

  loginUser(inputModel: LoginUserModel): Observable<IJwtResponse> {
    return this.httpClient.post<IJwtResponse>(Endpoints.Login, inputModel);;
  }

  refreshJwt(): Observable<IJwtResponse> {
    return this.httpClient.post<IJwtResponse>(Endpoints.RefreshJwt, {});
  }

  resetPassword(email: string): Observable<any> {
    return this.httpClient.post(Endpoints.ResetPass + `/${email}`, {});
  }

  persistSession(jwtResponse: IJwtResponse): void {
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

  getUserDetails(): Observable<IUserDetails> {
    return this.httpClient.get<IUserDetails>(Endpoints.UserDetails);
  }

  updateUserAccount(inputModel: UpdateUserModel) {
    return this.httpClient.post(Endpoints.UpdateUser, inputModel);
  }

  get isAdmin(): boolean {
    if (this.isUserLoggedIn) {
      return (JSON.parse(atob(localStorage.getItem('jwt')!.split('.')[1]))).roles?.includes('Admin') ?? false;
    }
    return false;
  }
}
