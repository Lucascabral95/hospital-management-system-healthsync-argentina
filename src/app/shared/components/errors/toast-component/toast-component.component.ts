import { Component, input } from '@angular/core';

@Component({
  selector: 'toast-component',
  imports: [],
  templateUrl: './toast-component.component.html',
})
export class ToastComponentComponent {

  toast = input.required<{ message: string, codeStatus: number }>();

}
