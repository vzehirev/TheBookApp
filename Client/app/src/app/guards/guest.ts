import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsersService } from '../services/users/users.service';

@Injectable({
    providedIn: 'root'
})
export class GuestGuard implements CanActivate {
    constructor(private usersService: UsersService, private router: Router) { }

    canActivate(): boolean {
        if (this.usersService.isUserLoggedIn) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}