import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import FormUtils from '../../../shared/utils/form-utils';
import ServiceAuth from '../../service/auth.service';
import { ToastComponentComponent } from "../../../shared/components/errors/toast-component/toast-component.component";
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterDto } from '../../interfaces';

@Component({
  selector: 'app-app-register',
  imports: [RouterLink, ReactiveFormsModule, ToastComponentComponent],
  templateUrl: './app-register.component.html',
})
export default class AppRegisterComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  formUtils = FormUtils;
  authService = inject(ServiceAuth)

  toastStatusCode = signal<{ message: string, codeStatus: number }>({ message: '', codeStatus: 0 })
  errorRequest = signal<HttpErrorResponse | null>(null)
  loadingRequest = signal<boolean>(false)

  myForm = this.fb.group({
    full_name: ['', [Validators.required, Validators.pattern(/^\s*\S+\s+\S+/)]],
    role: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^@]+@[^@]+\.com$/i)]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/)]],
  });

  onSubmit() {
    if (this.myForm.valid) {
      this.loadingRequest.set(true)

      const registerDto: RegisterDto = {
        full_name: this.myForm.value.full_name ?? '',
        role: this.myForm.value.role ?? '',
        email: this.myForm.value.email?.toLowerCase() ?? '',
        password: this.myForm.value.password ?? ''
      };

      this.authService.register(registerDto).subscribe({
        next: (res: any) => {
          this.loadingRequest.set(false)
          this.toastStatusCode.set({ message: res.message ?? 'Registro exitoso', codeStatus: 200 })
          setTimeout(() => {
            this.toastStatusCode.set({ message: '', codeStatus: 0 })
            this.router.navigate(['/auth']);
          }, 2500);
        },
        error: (err: HttpErrorResponse) => {
          this.loadingRequest.set(false)
          this.errorRequest.set(err.error)
          this.toastStatusCode.set({ message: err.error?.error ?? 'Internal Server Error', codeStatus: 500 })
          setTimeout(() => {
            this.toastStatusCode.set({ message: '', codeStatus: 500 })
          }, 2500);
        }
      });

    } else {
      this.myForm.markAllAsTouched()
    }
  }

}
