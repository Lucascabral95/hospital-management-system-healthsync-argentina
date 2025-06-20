import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { PatientsService } from '../../service/patients-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PatientsByIDDto } from '../../interfaces/patients-by-id.interface';
import ModalPatchPatientsComponentComponent from "../../components/modal-patch-patients/modal-patch-patients-component/modal-patch-patients-component.component";
import { MedicaRecordsPatientsComponentComponent } from "../../components/medical-records-patients/medica-records-patients-component/medica-records-patients-component.component";
import ErrorRequestComponentComponent from "../../../shared/components/errors/error-request-component/error-request-component.component";
import ServiceAuth from '../../../auth/service/auth.service';

@Component({
  selector: 'app-patient-detail',
  imports: [ModalPatchPatientsComponentComponent, MedicaRecordsPatientsComponentComponent, ErrorRequestComponentComponent],
  templateUrl: './patient-detail.component.html',
})
export default class PatientDetailComponent {
  router = inject(Router)
  route = inject(ActivatedRoute)
  patientService = inject(PatientsService)
  authService = inject(ServiceAuth)

  currentID = toSignal(this.route.queryParamMap.pipe(
    map(params => {
      const idParams = params.get('id')
      if (idParams === null) return undefined;

      const numericId = +idParams
      return isNaN(numericId) ? undefined : numericId
    })
  ))

  errorRequest = signal<HttpErrorResponse | null>(null)
  patientsDetails = signal<PatientsByIDDto | null>(null)
  loading = signal<boolean>(true)
  isOpenModal = signal<boolean>(false)
  rolePersonal = signal<string | null | undefined>(this.authService.rolePersonal())

  private previousModalState = false;

  constructor() {
    effect(() => {
      const patientID = this.currentID();
      const modalIsOpen = this.isOpenModal();

      if (this.previousModalState && !modalIsOpen) {
        this.loadPatientData(patientID);
      } else if (patientID && !this.patientsDetails()) {
        this.loadPatientData(patientID);
      }

      this.previousModalState = modalIsOpen;
    });
  }

  loadPatientData(patientID: number | undefined) {
    if (patientID) {
      this.patientService.onClearPatientByIdCache(patientID);

      this.loading.set(true);
      this.patientService.getPatientsById(patientID).subscribe({
        next: (patient) => {
          this.patientsDetails.set(patient);
          this.loading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          console.log(err);
          this.errorRequest.set(err);
        }
      });
    } else {
      console.log(`ID de paciente no es válido o no fue proporcionado. No se llamará al servicio.`);
    }
  }
}
