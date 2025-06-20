import { Component, effect, inject, output, signal } from '@angular/core';
import { PatientsService } from '../../../service/patients-service.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import ServiceAuth from '../../../../auth/service/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ServiceIntermnentService } from '../../../../interment/service/service-intermnent.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CreateDiagnosisDto } from '../../../interfaces/medical-records/create-diagnosis.interface';
import { ServiceDoctor } from '../../../../doctors/service/service-doctor.service';

@Component({
  selector: 'modal-create-diagnosis-component',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-create-diagnosis-component.component.html',
})
export class ModalCreateDiagnosisComponentComponent {
  servicePatient = inject(PatientsService);
  serviceInterment = inject(ServiceIntermnentService);
  authService = inject(ServiceAuth);
  doctorService = inject(ServiceDoctor);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);

  idDoctor = signal<number>(this.authService.idPersonal());

  myForm = this.fb.group({
    reasonForVisit: this.fb.control({ value: '', disabled: false }, { validators: [Validators.required], nonNullable: true }),
    diagnosis: this.fb.control({ value: '', disabled: false }, { validators: [Validators.required], nonNullable: true }),
    treatment: this.fb.control({ value: '', disabled: false }, { validators: [Validators.required], nonNullable: true }),
  });

  patientID = toSignal(this.route.queryParamMap.pipe(
    map(params => {
      const idParams = params.get('id');
      if (idParams === null) return undefined;
      const numericId = +idParams;
      return isNaN(numericId) ? undefined : numericId;
    })
  ));

  diagnosisCreated = signal<boolean>(false);

  close = output<boolean>();

  constructor() {
    effect(() => {
      if (this.patientID()) {
        this.servicePatient.getPatientsById(this.patientID()!).subscribe();
        this.doctorService.getDoctorForIdJwt(this.authService.idPersonal()).subscribe();
      }
    });
  }

  pacienteNombre() {
    const id = this.patientID();
    const paciente = this.servicePatient.cachePatientsDetail.get(id!.toString());
    return paciente ? `${paciente.name} ${paciente.last_name}` : '';
  }

  createDiagnosis() {
    if (this.myForm.valid) {
      const createDiagnosis: CreateDiagnosisDto = {
        // doctorId: this.idDoctor(),
        doctorId: this.doctorService.doctorIdAuth()!,
        // doctorId: this.idDoctor(),
        patientsId: this.patientID()!,
        reasonForVisit: this.myForm.get('reasonForVisit')?.value ?? 'No especificado',
        diagnosis: this.myForm.get('diagnosis')?.value ?? 'No especificado',
        treatment: this.myForm.get('treatment')?.value ?? 'No especificado',
      };

      this.diagnosisCreated.set(true);

      this.servicePatient.addDiagnosisPatient(createDiagnosis).subscribe({
        next: () => {
          this.closeModal(false);
          location.reload();
        },
        error: (err: HttpErrorResponse) => {
          this.diagnosisCreated.set(false);
          console.log(err);
        },
      });
    } else {
      this.myForm.markAllAsTouched();
    }
  }

  closeModal(value: boolean) {
    this.close.emit(value);
  }
}
