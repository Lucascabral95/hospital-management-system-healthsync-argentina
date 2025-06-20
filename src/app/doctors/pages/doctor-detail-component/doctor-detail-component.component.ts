import { Component, effect, inject, signal } from '@angular/core';
import { ServiceDoctor } from '../../service/service-doctor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { DoctorDetail } from '../../interfaces/doctor-detail.interface';
import { HttpErrorResponse } from '@angular/common/http';
import ServiceAuth from '../../../auth/service/auth.service';
import { ModalCrudComponentComponent } from '../../components/modal-patch-doctor-component/modal-patch-doctor-component.component';
import { MedicalRecordsDoctorComponentComponent } from "../../components/medical-records-doctor/medical-records-doctor-component/medical-records-doctor-component.component";
import ErrorRequestComponentComponent from "../../../shared/components/errors/error-request-component/error-request-component.component";

@Component({
  selector: 'app-doctor-detail-component',
  imports: [ModalCrudComponentComponent, MedicalRecordsDoctorComponentComponent, ErrorRequestComponentComponent],
  templateUrl: './doctor-detail-component.component.html',
})
export default class DoctorDetailComponentComponent {
  doctorService = inject(ServiceDoctor)
  router = inject(Router)
  route = inject(ActivatedRoute)
  authService = inject(ServiceAuth)

  isOpenModal = signal<boolean>(false)

  doctorDetail = signal<DoctorDetail | null>(null)
  isLoading = signal<boolean>(true)
  errorRequest = signal<HttpErrorResponse | null>(null)
  myIDPersonal = signal<number>(this.authService.idPersonal())
  myRolePersonal = signal<string | null | undefined>(this.authService.rolePersonal())

  doctorId = toSignal(this.route.queryParamMap.pipe(
    map(params => {
      const idParams = params.get('id') ?? this.myIDPersonal()
      if (idParams === null) return undefined;

      const numericId = +idParams
      return isNaN(numericId) ? undefined : numericId
    })
  ))

  constructor() {
    effect(() => {
      const currentId = this.doctorId()

      if (currentId) {
        this.doctorService.getMedicalRecordsOfDoctorById(currentId!).subscribe()
      }

      if (typeof currentId === 'number') {
        this.doctorService.getDoctorById(currentId).subscribe({
          next: (doctor) => {
            this.doctorDetail.set(doctor)
            this.isLoading.set(false)
          },
          error: (err: HttpErrorResponse) => {
            this.isLoading.set(false)
            this.errorRequest.set(err)
          }
        })
      } else {
        console.log(`ID de doctor no es valido o no fue proporcionado. No se llamara al servicio.`);
      }
    })
  }

}

