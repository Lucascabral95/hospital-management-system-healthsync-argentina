import { Component, effect, inject, input, output } from '@angular/core';
import { PatientsService } from '../../../service/patients-service.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { UpdatePatientsDTO } from '../../../interfaces/patients-update.interface';
import { Gender } from '../../../interfaces/patients-get.interface';

@Component({
  selector: 'app-modal-patch-patients-component',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-patch-patients-component.component.html',
})
export default class ModalPatchPatientsComponentComponent {
  patientsService = inject(PatientsService)
  close = output<boolean>();
  fb = inject(FormBuilder);
  isIDPatient = input.required<number>();

  myForm = this.fb.group({
    dni: ['', []],
    name: ['', []],
    last_name: ['', []],
    date_born: ['', []],
    gender: ['', []],
    phone: ['', []],
    email: ['', []],
    is_admitted: ['', []],
    street: ['', []],
    city: ['', []],
    state: ['', []],
    zip_code: ['', []],
    country: ['', []],
  })

  constructor() {
    effect(() => {
      const id = this.isIDPatient()
      if (id) {

        const sub$ = this.patientsService.getPatientsById(id).pipe(
          tap((res) => {
            this.myForm.patchValue({
              dni: res.dni,
              name: res.name,
              last_name: res.last_name,
              date_born: res.date_born ? new Date(res.date_born).toISOString().split('T')[0] : '',
              gender: res.gender,
              phone: res.phone,
              email: res.email,
              street: res.street,
              city: res.city,
              state: res.state,
              zip_code: res.zip_code,
              country: res.country,
            });
            catchError((error: HttpErrorResponse) => {
              console.log(error);
              return of(null);
            })
          })
        ).subscribe()

        return () => sub$.unsubscribe();
      } else {
        return
      }
    })
  }
  onSubmit() {
    if (this.myForm.valid && this.myForm.dirty) {
      const patchPatient: UpdatePatientsDTO = {
        dni: this.myForm.value.dni ?? '',
        name: this.myForm.value.name ?? '',
        last_name: this.myForm.value.last_name ?? '',
        date_born: this.myForm.value.date_born ?? '',
        gender: (this.myForm.value.gender as Gender) ?? '',
        phone: this.myForm.value.phone ?? '',
        email: this.myForm.value.email ?? '',
        street: this.myForm.value.street ?? '',
        city: this.myForm.value.city ?? '',
        state: this.myForm.value.state ?? '',
        zip_code: this.myForm.value.zip_code ?? '',
        country: this.myForm.value.country ?? '',
      };

      this.patientsService.updatePatientById(this.isIDPatient(), patchPatient).subscribe({
        next: (res) => {
          this.closeModal();
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
    } else {
      this.myForm.markAllAsTouched();
    }
  }

  closeModal() {
    this.close.emit(false);
  }
}
