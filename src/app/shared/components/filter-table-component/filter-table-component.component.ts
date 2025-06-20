import { Component, input, output } from '@angular/core';

@Component({
  selector: 'filter-table-component',
  imports: [],
  templateUrl: './filter-table-component.component.html',
})
export class FilterTableComponentComponent {
  columnsPatients = input.required();
  patients = input.required()

  searchInput = output<string>()
  sortOrder = input.required()
  filter = output<string>()

}
