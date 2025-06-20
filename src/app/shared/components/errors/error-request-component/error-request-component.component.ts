import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../../environments/environment.development';

const EMAIL = environment.emailMine

@Component({
  selector: 'error-request-component',
  imports: [RouterLink],
  templateUrl: './error-request-component.component.html',
})
export default class ErrorRequestComponentComponent {
  message = input()
  messageErrorRequest = input()

  messageInterno = input<boolean>()

  emailMine = () => EMAIL;

}
