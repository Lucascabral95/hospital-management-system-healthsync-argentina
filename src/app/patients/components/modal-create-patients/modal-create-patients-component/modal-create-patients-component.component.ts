import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientsService } from '../../../service/patients-service.service';
import { CreatePatientsDTO } from '../../../interfaces/patients-create.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { Gender } from '../../../interfaces/patients-get.interface';

@Component({
  selector: 'modal-create-patients-component',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-create-patients-component.component.html',
})
export class ModalCreatePatientsComponentComponent {
  fb = inject(FormBuilder)
  servicePatient = inject(PatientsService)

  createdPatient = signal<boolean>(false)

  myForm = this.fb.group({
    dni: ['', [Validators.required]],
    name: ['', [Validators.required]],
    last_name: ['', [Validators.required]],
    date_born: ['', [Validators.required]],
    gender: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    street: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    zip_code: ['', [Validators.required]],
    country: ['', [Validators.required]],
  })

  addPatient() {
    if (this.myForm.valid) {
      const createPatient: CreatePatientsDTO = {
        dni: this.myForm.value.dni ?? '',
        name: this.myForm.value.name ?? '',
        last_name: this.myForm.value.last_name ?? '',
        date_born: this.myForm.value.date_born ?? '',
        gender: this.myForm.value.gender as Gender || Gender.Female,
        phone: this.myForm.value.phone ?? '',
        email: this.myForm.value.email ?? '',
        street: this.myForm.value.street ?? '',
        city: this.myForm.value.city ?? '',
        state: this.myForm.value.state ?? '',
        zip_code: this.myForm.value.zip_code ?? '',
        country: this.myForm.value.country ?? '',
      }
      this.servicePatient.createPatient(createPatient).subscribe({
        next: () => {
          this.createdPatient.set(true);
          setTimeout(() => {
            location.reload();
          }, 1400);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
    } else {
      this.myForm.markAllAsTouched();
    }
  }

  close = output<boolean>();

  closeModal(value: boolean) {
    this.close.emit(value);
  }

}


