import { Component, input, output } from '@angular/core';

@Component({
  selector: 'search-table-component',
  imports: [],
  templateUrl: './search-table-component.component.html',
})
export default class SearchTableComponentComponent {
  searchInput = output<string>();
  sortOrder = input.required()
  filter = output<string>()
}
