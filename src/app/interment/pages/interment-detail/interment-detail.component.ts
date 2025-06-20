import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ServiceIntermnentService } from '../../service/service-intermnent.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Status } from '../../interfaces/update-interment.interface';
import { ToastComponentComponent } from "../../../shared/components/errors/toast-component/toast-component.component";
import { ModalAddDiagnosisComponent } from "../../components/modal-add-diagnosis/modal-add-diagnosis.component";

@Component({
  selector: 'app-interment-detail',
  imports: [DatePipe, ReactiveFormsModule, ToastComponentComponent, ModalAddDiagnosisComponent, RouterLink],
  templateUrl: './interment-detail.component.html',
})
export default class IntermentDetailComponent {
  router = inject(Router)
  route = inject(ActivatedRoute)
  serviceInterment = inject(ServiceIntermnentService)
  fb = inject(FormBuilder)

  formInterments = this.fb.group({
    status: [''],
    dischargeDate: [''],
  })
  isVisibleButtonInterments = signal<boolean>(false)

  formDiagnosis = this.fb.group({
    code: [''],
    description: [''],
    category: [''],
  })
  isVisibleButtonDiagnosis = signal<boolean>(false)

  appointmentID = toSignal(this.route.queryParamMap.pipe(
    map(params => {
      const idParams = params.get('id')
      if (idParams === null) return undefined;

      const numericId = +idParams
      return isNaN(numericId) ? undefined : numericId
    })
  ))

  constructor() {
    effect(() => {

      if (!this.appointmentID()) return

      this.serviceInterment.getIntermentById(this.appointmentID()!).subscribe({
        next: (res) => {
          this.formInterments.patchValue({
            status: res.status,
            dischargeDate: res.dischargeDate,
          })
          this.formDiagnosis.patchValue({
            code: res.Diagnosis[0]?.code,
            description: res.Diagnosis[0]?.description,
            category: res.Diagnosis[0]?.category,
          })
          this.isVisibleButtonInterments.set(false)
          this.isVisibleButtonDiagnosis.set(false)
        }
      })

      this.formInterments.valueChanges.subscribe(() => {
        this.isVisibleButtonInterments.set(this.formInterments.dirty)
      })

      this.formDiagnosis.valueChanges.subscribe(() => {
        this.isVisibleButtonDiagnosis.set(this.formDiagnosis.dirty)
      })

    })
  }

  toastStatusCode = signal<{ message: string, codeStatus: number }>({ message: '', codeStatus: 0 })

  clearPatient(status: Status) {
    if (!this.appointmentID()) return

    this.serviceInterment.updateIntermentStatusById(this.appointmentID()!, status).subscribe({
      next: (res) => {
        this.toastStatusCode.set({ message: 'Paciente actualizado', codeStatus: 200 })
        this.serviceInterment.intermentGetByID.update(prev => {
          if (!prev) return prev
          return { ...prev, status: status }
        })
        setTimeout(() => {
          this.toastStatusCode.set({ message: '', codeStatus: 0 })
        }, 2500);
      },
      error: (err: HttpErrorResponse) => {
        this.toastStatusCode.set({ message: err.message, codeStatus: 500 })
        setTimeout(() => {
          this.toastStatusCode.set({ message: '', codeStatus: 0 })
        }, 2500);
      }
    })
  }

  onSubmitInterment() {
    if (this.formInterments.valid) {
      console.log(this.formInterments.value)
    } else {
      console.log(this.formInterments.value)
      this.formInterments.markAllAsTouched()
    }
  }

  onSubmitDiagnosis() {
    if (this.formDiagnosis.valid) {
      console.log(this.formDiagnosis)
    } else {
      console.log(this.formDiagnosis)
      this.formDiagnosis.markAllAsTouched()
    }
  }

  // ------ add diagnosis ----
  isOpenModalAddDiagnosis = signal<boolean>(false)
}
