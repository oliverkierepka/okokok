import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'rh-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() label = 'NO LABEL SET';
  @Output() buttonClicked: EventEmitter<string> = new EventEmitter<string>();

  onClick() {
    this.buttonClicked.emit('Button clicked');
  }
}
