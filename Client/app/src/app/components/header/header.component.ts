import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private usersService: UsersService) {
  }

  ngOnInit(): void {
    this.initMobileMenu();
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
