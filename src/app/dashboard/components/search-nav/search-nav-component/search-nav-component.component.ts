import { Component, inject, signal } from '@angular/core';
import ServiceAuth from '../../../../auth/service/auth.service';
import { JWTPayload } from '../../../../admin/interfaces/jwt-payload.interface';
import ModalSearchComponentComponent from "../../../../shared/components/modal-search/modal-search-component/modal-search-component.component";

@Component({
  selector: 'search-nav-component',
  imports: [ModalSearchComponentComponent],
  templateUrl: './search-nav-component.component.html',
})
export class SearchNavComponentComponent {
  authService = inject(ServiceAuth)

  name = signal<JWTPayload | null>(this.authService.getLocalStorage());
  role = signal<JWTPayload | null>(this.authService.getLocalStorage());

  searchModal = signal<boolean>(false)
}
