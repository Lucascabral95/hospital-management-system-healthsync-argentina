import { Component, effect, inject, signal } from '@angular/core';
import ServiceAppointments from '../../../service/appointments-service.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastComponentComponent } from "../../../../shared/components/errors/toast-component/toast-component.component";
import { PatientsService } from '../../../../patients/service/patients-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GetDataPatientAppointmentDto } from '../../../interfaces/get-patient-appointment.interface';
import { Specialties } from '../../../interfaces/specialties.enum';
import { CreateAppointmentDto } from '../../../interfaces/create-appointment.interface';

@Component({
  selector: 'app-patient-appointment',
  imports: [ReactiveFormsModule, ToastComponentComponent],
  templateUrl: './patient-appointment.component.html',
})
export default class PatientAppointmentComponent {
  fb = inject(FormBuilder)
  serviceAppoinment = inject(ServiceAppointments)
  servicePatient = inject(PatientsService)

  toastStatusCode = signal<{ message: string; codeStatus: number }>({
    message: '',
    codeStatus: 0,
  });

  loading = signal<boolean>(false);
  dni = signal<string>('');
  errors = signal<HttpErrorResponse | null>(null);
  dataPatient = signal<GetDataPatientAppointmentDto | null>(null)

  constructor() {
    effect(() => {
      const myDni = this.dni();
      this.errors.set(null);
      this.dataPatient.set(null);
      this.loading.set(true);

      this.servicePatient.getDataPatientForAppointment(myDni).subscribe({
        next: (res) => {
          this.dataPatient.set(res);
          this.loading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.errors.set(err);
          console.log(err);
          this.loading.set(false);
        }
      })
    })
  }

  myForm = this.fb.group({
    specialty: ['', [Validators.required]],
  })

  onSubmit() {
    this.toastStatusCode.set({ message: '', codeStatus: 0 });
    const timeout = 2500

    if (this.myForm.valid && this.dataPatient()?.id !== null) {
      const createAppointment: CreateAppointmentDto = {
        patientsId: Number(this.dataPatient()!.id),
        specialty: this.myForm.value.specialty as Specialties,
      }

      this.serviceAppoinment.createAppointment(createAppointment)
      this.toastStatusCode.set({ message: 'Turno solicitado con exito', codeStatus: 200 });

      setTimeout(() => {
        this.loading.set(false);
        this.dni.set('');
        this.myForm.reset();
      }, timeout);
    } else {
      this.toastStatusCode.set({ message: 'Error al solicitar el turno', codeStatus: 200 });
      alert('Formulario no valido')
      this.myForm.markAllAsTouched()

      setTimeout(() => {
        this.loading.set(false);
        this.dni.set('');
        this.myForm.reset();
      }, timeout);
    }
  }

}
