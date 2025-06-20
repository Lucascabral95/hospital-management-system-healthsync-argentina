import { Component, computed, inject, signal } from '@angular/core';
import { map, tap, catchError, throwError } from 'rxjs';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { PatientsService } from '../../service/patients-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExceptionError } from '../../../shared/interfaces/exception-error.interface';
import { GetPatients } from '../../interfaces/patients-get.interface';
import TablePatientsComponent from "../../components/table-patients/table-patients.component";
import { HttpErrorResponse } from '@angular/common/http';
import ErrorRequestComponentComponent from "../../../shared/components/errors/error-request-component/error-request-component.component";
import { ModalCreatePatientsComponentComponent } from "../../components/modal-create-patients/modal-create-patients-component/modal-create-patients-component.component";

@Component({
  selector: 'app-app-patients',
  imports: [TablePatientsComponent, ErrorRequestComponentComponent, ModalCreatePatientsComponentComponent],
  templateUrl: './app-patients.component.html',
})
export default class AppPatientsComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  patientsList = inject(PatientsService);

  page = toSignal(this.route.queryParamMap.pipe(map(params => Number(params.get('page')) || 1)));
  sortedBy = toSignal(this.route.queryParamMap.pipe(map(params => params.get('orderBy') || 'name')));
  order = toSignal(this.route.queryParamMap.pipe(map(params => params.get('order') || 'desc')));

  errorsPatients = signal<ExceptionError>({ status: 0, message: '' });
  quantityPages = toSignal(this.patientsList.getPatients().pipe(map((res: GetPatients) => res.totalPages)));
  columnsPatients = signal(this.patientsList.patients);
  patients = signal<GetPatients | null>(null);

  filter = signal('Todos');
  searchQuery = signal('');

  patientsArray = rxResource({
    request: () => ({ page: this.page(), sortedBy: this.sortedBy(), order: this.order() }),
    loader: ({ request }) => this.patientsList.getPatients(request.page, request.sortedBy, request.order).pipe(
      tap((patients: GetPatients) => this.patients.set(patients)),
      map((res: GetPatients) => res.data),
      catchError((error: HttpErrorResponse) => {
        this.errorsPatients.set({ status: error?.status || 500, message: "No se encontraron pacientes" });
        return throwError(() => error);
      })
    )
  });

  filtered = computed(() => {
    let result = [...(this.patients()?.data ?? [])];
    const search = this.searchQuery().toLowerCase();
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search));
    switch (this.filter()) {
      case 'Nombre: ascendente': return result.sort((a, b) => a.name.localeCompare(b.name));
      case 'Nombre: descendente': return result.sort((a, b) => b.name.localeCompare(a.name));
      case 'Fecha de nacimiento: ascendente': return result.sort((a, b) => new Date(a.date_born).getTime() - new Date(b.date_born).getTime());
      case 'Fecha de nacimiento: descendente': return result.sort((a, b) => new Date(b.date_born).getTime() - new Date(a.date_born).getTime());
      default: return result;
    }
  });

  goToPage(newPage: number) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { page: newPage, sortedBy: this.sortedBy(), order: this.order() } });
  }
  onSearch(value: string) { this.searchQuery.set(value); }
  onFilter(value: string) { this.filter.set(value); this.goToPage(1); }


  /// Open modal ////
  isOpenModal = signal<boolean>(false)

}
