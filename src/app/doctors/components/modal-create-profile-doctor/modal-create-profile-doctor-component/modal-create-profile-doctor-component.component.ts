import { Component, effect, inject, input, output, signal } from '@angular/core';
import { ServiceDoctor } from '../../../service/service-doctor.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'modal-create-profile-doctor-component',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-create-profile-doctor-component.component.html',
})
export default class ModalCreateProfileDoctorComponentComponent {
  doctorService = inject(ServiceDoctor)
  fb = inject(FormBuilder)
  doctorID = input.required<number>()
  loadingRequest = signal<boolean>(false)
  errorRequest = signal<HttpErrorResponse | null>(null)

  myForm = this.fb.group({
    specialty: ['', [Validators.required]],
    licenceNumber: ['', [Validators.required]],
  })

  onSubmit() {
    if (this.myForm.valid) {

      this.loadingRequest.set(true)

      const createProfileDoctor = {
        specialty: this.myForm.value.specialty!,
        licenceNumber: Number(this.myForm.value.licenceNumber),
        authId: Number(this.doctorID())!,
      }

      this.doctorService.createProfileDoctor(createProfileDoctor).subscribe({
        next: (res) => {
          console.log(res)
          this.loadingRequest.set(false)
          location.reload()
        },
        error: (err: HttpErrorResponse) => {
          console.log(err)
          this.loadingRequest.set(false)
          this.errorRequest.set(err.error)
        }
      })

      console.log(this.myForm.value)
    } else {
      console.log(this.myForm.value)
      this.myForm.markAllAsTouched()
    }
  }





  close = output<boolean>();

  closeModal(value: boolean) {
    this.close.emit(value);
  }

}
