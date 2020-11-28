import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    public usersService: UsersService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.initMobileMenu();
  }

  logout() {
    this.usersService.logoutUser();
    this.router.navigate(['/']);
  }

  private initMobileMenu(): void {
    let script = this.renderer2.createElement('script');
    script.text = `document.addEventListener('DOMContentLoaded', function () {
      var elems = document.querySelectorAll('.sidenav');
      var instances = M.Sidenav.init(elems);
    });`;

    this.renderer2.appendChild(this.document.body, script);
  }
}
