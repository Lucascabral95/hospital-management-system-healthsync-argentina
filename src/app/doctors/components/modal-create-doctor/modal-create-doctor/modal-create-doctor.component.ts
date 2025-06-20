import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import ServiceAuth from '../../../../auth/service/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'modal-create-doctor',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-create-doctor.component.html',
})
export default class ModalCreateDoctorComponent {
  fb = inject(FormBuilder);
  authService = inject(ServiceAuth);

  myForm = this.fb.group({
    full_name: ['', [Validators.required, Validators.pattern(/^\s*\S+\s+\S+/)]],
    email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^@]+@[^@]+\.com$/i)]],
    role: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/)]],
  });

  loadingRequest = signal<boolean>(false)
  errorRequest = signal<HttpErrorResponse | null>(null)

  onSubmit() {
    if (this.myForm.valid) {

      this.loadingRequest.set(true)

      const registerDto = {
        full_name: this.myForm.value.full_name!,
        email: this.myForm.value.email?.toLocaleLowerCase()!,
        role: this.myForm.value.role!,
        password: this.myForm.value.password!,
      }

      this.authService.register(registerDto).subscribe({
        next: (res: any) => {
          console.log(res);
          this.loadingRequest.set(false)
          // this.closeModal(false);
          location.reload();
        },
        error: (err: HttpErrorResponse) => {
          this.loadingRequest.set(false)
          this.errorRequest.set(err.error)
          console.log(err);
        },
      });

      console.log(this.myForm.value);
    } else {
      this.myForm.markAllAsTouched();
    }
  }

  close = output<boolean>();

  closeModal(value: boolean) {
    this.close.emit(value);
  }
}
