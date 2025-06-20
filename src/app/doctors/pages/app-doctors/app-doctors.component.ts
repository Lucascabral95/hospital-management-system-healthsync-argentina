import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TableDoctorsComponent } from "../../components/table-doctors/table-doctors.component";
import { ServiceDoctor } from '../../service/service-doctor.service';
import { ExceptionError } from '../../../shared/interfaces/exception-error.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, tap, throwError } from 'rxjs';
import { Doctors } from '../../interfaces/doctors.interface';
import { SortOrderDoctor } from '../../interfaces/doctors-table.interface';
import { HttpErrorResponse } from '@angular/common/http';
import ErrorRequestComponentComponent from "../../../shared/components/errors/error-request-component/error-request-component.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-doctors',
  templateUrl: './app-doctors.component.html',
  imports: [ReactiveFormsModule, TableDoctorsComponent, ErrorRequestComponentComponent],
})
export default class DoctorsComponent {
  doctorsList = inject(ServiceDoctor)

  columnsDoctors = signal<string[]>(this.doctorsList.columnsDoctors);
  doctors = signal<Doctors | null>(null)
  errorsDoctors = signal<ExceptionError>({ status: 0, message: '' })
  searchInput = signal<string>('')
  filterSelected = signal<SortOrderDoctor>('Todos')

  filtered = computed(() => {
    const searchTerm = this.searchInput().toLowerCase();
    const doctorsData = this.doctors()?.data || [];
    const selectedFilter = this.filterSelected();

    let filteredData = doctorsData.filter(doctor =>
      doctor.full_name.toLowerCase().includes(searchTerm)
    );

    switch (selectedFilter) {
      case "Nombre: ascendente":
        return [...filteredData].sort((a, b) => a.full_name.localeCompare(b.full_name));
      case "Nombre: descendente":
        return [...filteredData].sort((a, b) => b.full_name.localeCompare(a.full_name));
      case "Sólo activos":
        return filteredData.filter(doctor => doctor.is_active);
      case "Todos":
      default:
        return filteredData;
    }
  });

  doctorsArray = rxResource({
    request: () => ({}),
    loader: () => this.doctorsList.getDoctors().pipe(
      tap(doctors => this.doctors.set(doctors)),
      map(res => res.data),
      catchError((error: HttpErrorResponse) => {
        this.errorsDoctors.set({
          status: error?.status || 500,
          message: 'No se encontraron pacientes'
        });
        return throwError(() => error);
      })
    )
  });

  onSearch(value: string) {
    this.searchInput.set(value.trim());
  }

  onChange(value: any) {
    this.filterSelected.set(value)
  }

}
