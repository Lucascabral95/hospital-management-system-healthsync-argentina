import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'pagination-component',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pagination-component.component.html',
})
export class PaginationComponentComponent {
  quantityPages = input.required<number>();


  router = inject(Router)

  getRoute() {
    const urlIncludes = this.router.url.includes('admin')

    const url = urlIncludes ? '/admin/patients' : '/patients'
    return url;
  }

  currentPage = input.required<number>();
  arrayPages = () => Array.from({ length: this.quantityPages() }, (_, index) => index + 1);
}
