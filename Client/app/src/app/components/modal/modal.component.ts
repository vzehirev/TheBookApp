import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  message!: string;
  closeModal: EventEmitter<boolean> = new EventEmitter();

  setMessage(message: string) {
    this.message = message;
  }
}
