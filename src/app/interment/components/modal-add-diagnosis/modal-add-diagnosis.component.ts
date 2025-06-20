import { Component, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceIntermnentService } from '../../service/service-intermnent.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddAndCreateDiagnosisDto } from '../../interfaces/create-diagnosis.interface';
import { Category } from '../../interfaces/create-interment.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { PatientsService } from '../../../patients/service/patients-service.service';

@Component({
  selector: 'app-modal-add-diagnosis',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-add-diagnosis.component.html',
})
export class ModalAddDiagnosisComponent {
  router = inject(Router)
  serviceInterment = inject(ServiceIntermnentService)
  servicePatients = inject(PatientsService)
  fb = inject(FormBuilder)

  addFormDiagnosis = this.fb.group({
    code: ['', [Validators.required]],
    description: ['', [Validators.required]],
    category: ['', [Validators.required]],
  })

  successRequest = signal<boolean>(false)

  addDiagnosis() {
    if (!this.intermentID()) return

    if (this.addFormDiagnosis.valid) {
      const diagnosis: AddAndCreateDiagnosisDto = {
        code: this.addFormDiagnosis.get('code')?.value as string,
        description: this.addFormDiagnosis.get('description')?.value as string,
        category: this.addFormDiagnosis.get('category')?.value as Category,
      }

      this.serviceInterment.addDiagnosis(this.intermentID(), diagnosis).subscribe({
        next: () => {
          this.successRequest.set(true)
          setTimeout(() => {
            this.onClose(false)
          }, 2500);
        },
        error: (err: HttpErrorResponse) => {
          this.onClose(false)
          console.log(err);
        }
      })

    } else {
      this.addFormDiagnosis.markAllAsTouched()
    }
  }


  // --- Parameters ---

  intermentID = input.required<number>();

  close = output<boolean>();

  onClose(value: boolean) {
    this.close.emit(value);
  }

}
