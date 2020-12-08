import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { LoadingSpinnerService } from './services/loading/loading,service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  isLoading!: Subject<boolean>;

  constructor(private loadingSpinnerService: LoadingSpinnerService) {
  }

  ngOnInit() {
    this.isLoading = this.loadingSpinnerService.isLoading;
  }
}
