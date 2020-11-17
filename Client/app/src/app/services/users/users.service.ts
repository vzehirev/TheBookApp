import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  loginUser(username: string, password: string) {
    console.log('Logging user in...');
  }

  registerUser(username: string, email: string, password: string, confirmPassword: string) {
    console.log('Registering user...');
  }

  resetPassword(email: string) {
    console.log('Resetting password...');
  }
}
