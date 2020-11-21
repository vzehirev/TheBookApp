import { Component, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  message!: string;
  closeModal: Subject<boolean> = new Subject();

  setMessage(message: string) {
    this.message = message;
  }
}
