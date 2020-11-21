import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector } from '@angular/core';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalCompRef!: ComponentRef<ModalComponent>;
  private modalEl!: HTMLElement;
  private sub!: Subscription;

  constructor(
    private resolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  openModal(message: string) {
    this.modalCompRef = this.resolver.resolveComponentFactory(ModalComponent).create(this.injector);

    this.modalCompRef.instance.setMessage(message);

    this.appRef.attachView(this.modalCompRef.hostView);

    this.modalEl = (this.modalCompRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    document.body.appendChild(this.modalEl);

    this.sub = this.modalCompRef.instance.closeModal.pipe(filter(x => x === true)).subscribe(x => this.closeModal())

    return;
  }

  private closeModal() {
    document.body.removeChild(this.modalEl);
    this.sub.unsubscribe();
    this.modalCompRef.destroy();
  }
}