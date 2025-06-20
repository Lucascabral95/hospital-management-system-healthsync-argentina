import { Component, effect, inject, input, output } from '@angular/core';
import { ServiceDoctor } from '../../../service/service-doctor.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-modal-post-diagnosis-component',
  imports: [],
  templateUrl: './modal-post-diagnosis-component.component.html',
})
export class ModalPostDiagnosisComponentComponent {
  serviceDoctor = inject(ServiceDoctor)
  doctorId = input.required<number>()


  constructor() {
    effect(() => {
      const id = this.doctorId()
      if (id) {
        this.serviceDoctor.getMedicalRecordsOfDoctorById(id).subscribe({
          next: (res) => {
            console.log(res)
          },
          error: (err: HttpErrorResponse) => {
            console.log(err)
          }
        })
      } else {
        return
      }
    })
  }






  close = output<boolean>();

  closeModal(value: boolean) {
    this.close.emit(value);
  }
}
