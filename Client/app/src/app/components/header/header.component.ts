import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document) {
  }

  ngOnInit(): void {

    this.initMobileMenu();
  }

  private initMobileMenu(): void {

    let script = this._renderer2.createElement('script');
    script.text = `document.addEventListener('DOMContentLoaded', function () {
      var elems = document.querySelectorAll('.sidenav');
      var instances = M.Sidenav.init(elems);
    });`;

    this._renderer2.appendChild(this._document.body, script);
  }
}
