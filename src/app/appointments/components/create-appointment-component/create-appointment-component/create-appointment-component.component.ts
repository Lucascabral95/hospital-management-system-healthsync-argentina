import { Component, effect, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateAppointmentDto } from '../../../interfaces/create-appointment.interface';
import ServiceAppointments from '../../../service/appointments-service.service';
import { PatientsService } from '../../../../patients/service/patients-service.service';
import { Specialties } from '../../../interfaces/specialties.enum';
import { GetDataPatientAppointmentDto } from '../../../interfaces/get-patient-appointment.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'create-appointment-component',
  imports: [ReactiveFormsModule],
  templateUrl: './create-appointment-component.component.html',
})
export class CreateAppointmentComponentComponent {
  fb = inject(FormBuilder);
  serviceAppointment = inject(ServiceAppointments)
  servicePatient = inject(PatientsService)

  myForm = this.fb.group({
    specialty: [null as Specialties | null, [Validators.required]],
  })

  errors = signal<HttpErrorResponse | null>(null)
  dataPatient = signal<GetDataPatientAppointmentDto | null>(null)
  dni = signal<string>('')
  loading = signal<boolean>(false)

  constructor() {
    effect(() => {
      const currentDni = this.dni();
      this.dataPatient.set(null);
      this.errors.set(null);
      this.loading.set(true);

      this.servicePatient.getDataPatientForAppointment(currentDni).subscribe({
        next: (res) => {
          this.dataPatient.set(res)
          this.loading.set(false)
        },
        error: (err: HttpErrorResponse) => {
          this.errors.set(err)
          console.log(err);
          this.loading.set(false)
        }
      });
    });
  }

  onCreateAppointment() {

    if (this.myForm.valid && this.dataPatient()?.id !== null) {
      const createAppointment: CreateAppointmentDto = {
        patientsId: Number(this.dataPatient()!.id),
        specialty: this.myForm.value.specialty as Specialties,
      };

      this.serviceAppointment.createAppointment(createAppointment)

      this.closeModal(false);
    } else {
      this.myForm.markAllAsTouched();
    }
  }

  close = output<boolean>();

  closeModal(value: boolean) {
    this.close.emit(value);
  }
}

