import { Component, computed, inject, signal } from '@angular/core';
import { ServiceIntermnentService } from '../../service/service-intermnent.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, tap, throwError } from 'rxjs';
import { Data, GetInterments } from '../../interfaces/interments.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ExceptionError } from '../../../shared/interfaces/exception-error.interface';
import ErrorRequestComponentComponent from "../../../shared/components/errors/error-request-component/error-request-component.component";
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastComponentComponent } from "../../../shared/components/errors/toast-component/toast-component.component";
import { PatientsService } from '../../../patients/service/patients-service.service';
import { DataPatient } from '../../../patients/interfaces/patients-get.interface';
import { Category, CreateIntermentDto } from '../../interfaces/create-interment.interface';
import { Status } from '../../interfaces/update-interment.interface';

@Component({
  selector: 'app-interment-app',
  imports: [RouterLink, ErrorRequestComponentComponent, DatePipe, ReactiveFormsModule, ToastComponentComponent],
  templateUrl: './interment-app.component.html',
})
export default class IntermentAppComponent {
  serviceInterment = inject(ServiceIntermnentService)
  servicePatients = inject(PatientsService)
  errorsInterments = signal<ExceptionError>({
    status: 0,
    message: ''
  })

  filterStatus = this.serviceInterment.filterStatus

  intermentArraySignal = signal<GetInterments['data']>([])

  totalPages = signal<number>(0)
  currentPage = signal<number>(1)

  quantityPages = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, index) => index + 1);
  })

  intermentsArray = rxResource({
    request: () => ({
      page: this.page(),
      sortedBy: this.sortedBy(),
      order: this.order(),
      filter: this.onChangeFilter(),
      search: this.searchInput(),
    }),
    loader: ({ request }) =>
      this.serviceInterment.getInterments(
        request.page,
        request.sortedBy,
        request.order,
      ).pipe(
        tap((res: GetInterments) => {
          this.totalPages.set(Number(res.totalPages));
          this.currentPage.set(res.page);
          this.intermentArraySignal.set(request.filter === 'Todos' ? res.data.filter(i => i.patient.last_name.toLocaleLowerCase().includes(request.search.toLocaleLowerCase()) || i.patient.name.toLocaleLowerCase().includes(request.search.toLocaleLowerCase())) : res.data.filter(interment => interment.status === request.filter).filter(i => i.patient.last_name.toLocaleLowerCase().includes(request.search.toLocaleLowerCase()) || i.patient.name.toLocaleLowerCase().includes(request.search.toLocaleLowerCase())));
        }),
        map((res: GetInterments) => res.data),
        catchError((error: HttpErrorResponse) => {
          this.errorsInterments.set({
            status: error?.status || 500,
            message: "No se encontraron los pacientes internados",
          });
          return throwError(() => error);
        })
      )
  });

  onChangeFilter = signal<string>('Todos')

  router = inject(Router)
  route = inject(ActivatedRoute)

  page = toSignal<number>(this.route.queryParamMap.pipe(map(params => Number(params.get('page')) || 1)))
  sortedBy = toSignal<string>(this.route.queryParamMap.pipe(map(params => params.get('orderBy') || 'createdAt')))
  order = toSignal<string>(this.route.queryParamMap.pipe(map(params => params.get('order') || 'desc')))

  goToPage(newPage: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: newPage, sortedBy: this.sortedBy(), order: this.order() },
    });
  }

  searchInput = signal<string>('')

  // --------
  fb = inject(FormBuilder)
  closeModal = signal<boolean>(false)
  toastStatusCode = signal<{ message: string, codeStatus: number }>({ message: '', codeStatus: 0 })
  patients = signal<DataPatient[] | null>(null)

  constructor() {
    this.servicePatients.getPatientsWithoutCache().subscribe({
      next: (res) => {
        this.patients.set(res.data)
      }
    })
  }

  myForm = this.fb.group({
    patientId: ['', Validators.required],
    status: ['', Validators.required],
    code: ['', Validators.required],
    category: ['', Validators.required],
    description: ['', Validators.required],
  })

  addIntermentSubmit() {
    if (this.myForm.valid) {
      const createIntermentDto: CreateIntermentDto = {
        doctorId: 1,   /// a modicar!!!!
        patientId: Number(this.myForm.get('patientId')?.value),
        status: this.myForm.get('status')?.value as Status,
        diagnosis: [{
          code: this.myForm.get('code')?.value as string,
          description: this.myForm.get('description')?.value as string,
          category: this.myForm.get('category')?.value as Category,
        }],
      };

      this.serviceInterment.createInterment(createIntermentDto).subscribe({
        next: () => {
          this.toastStatusCode.set({ message: 'Internación creada', codeStatus: 200 });
          this.myForm.reset();
          this.closeModal.set(false);
          setTimeout(() => this.toastStatusCode.set({ message: '', codeStatus: 0 }), 2000);
          setTimeout(() => location.reload(), 1800);
        },
        error: ({ message, status }) => {
          this.toastStatusCode.set({ message, codeStatus: status });
          setTimeout(() => this.toastStatusCode.set({ message: '', codeStatus: 0 }), 3000);
        }
      });

    } else {
      this.myForm.markAllAsTouched();
    }
  }
}
