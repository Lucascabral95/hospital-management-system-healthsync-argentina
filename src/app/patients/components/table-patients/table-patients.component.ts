import { Component, input, output, signal } from '@angular/core';
import { FilterPatient } from '../../interfaces/filter-patient.interface';
import { PaginationComponentComponent } from "../../../shared/components/pagination-component/pagination-component.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-table-patients',
  imports: [PaginationComponentComponent, RouterLink],
  templateUrl: './table-patients.component.html',
})
export default class TablePatientsComponent {

  searchInput = output<string>()
  patients = input.required()
  columnsPatients = input.required()

  sorted = signal<FilterPatient[]>(["Nombre: ascendente", "Nombre: descendente", "Fecha de nacimiento: ascendente", "Fecha de nacimiento: descendente"])

  filter = output<string>()
  onChange(value: Event) {
    const val = (value.target as HTMLInputElement).value
    this.filter.emit(val)
  }

  quantityPages = input.required<number>()

  currentPage = input.required<number>()
}
