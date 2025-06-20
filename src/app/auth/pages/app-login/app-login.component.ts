import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import ServiceAuth from '../../service/auth.service';
import FormUtils from '../../../shared/utils/form-utils';
import { LoginDto, } from '../../interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastComponentComponent } from "../../../shared/components/errors/toast-component/toast-component.component";
import { environment } from '../../../../environments/environment.development';

const TOKEN_LS_KEY = environment.localStorage;

@Component({
  selector: 'app-app-login',
  imports: [RouterLink, ReactiveFormsModule, ToastComponentComponent],
  templateUrl: './app-login.component.html',
})
export default class AppLoginComponent {
  fb = inject(FormBuilder)
  formUtils = FormUtils;
  authService = inject(ServiceAuth)

  myForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  })

  errorRequest = signal<HttpErrorResponse | null>(null)
  toastStatusCode = signal<{ message: string, codeStatus: number }>({ message: '', codeStatus: 0 })
  loadingRequest = signal<boolean>(false)

  onSubmit() {
    if (this.myForm.valid) {
      this.loadingRequest.set(true)

      const loginDto: LoginDto = {
        email: this.myForm.value.email?.toLowerCase() ?? '',
        password: this.myForm.value.password ?? ''
      };

      this.authService.login(loginDto).subscribe({
        next: (res: any) => {
          this.loadingRequest.set(false)
          this.toastStatusCode.set({ message: res.message, codeStatus: 200 })
          localStorage.setItem(TOKEN_LS_KEY, res.token);
          setTimeout(() => {
            this.toastStatusCode.set({ message: '', codeStatus: 200 })
            // this.authService.router.navigate(['/patients']);
            this.authService.router.navigate(['/doctors/detail']);
          }, 1500);
        },
        error: (err: HttpErrorResponse) => {
          this.loadingRequest.set(false)
          this.errorRequest.set(err.error)
          this.toastStatusCode.set({ message: err.error?.error ?? 'Internal Server Error', codeStatus: 500 })
          setTimeout(() => {
            this.toastStatusCode.set({ message: '', codeStatus: 500 })
          }, 1500);
        }
      });
    } else {
      this.myForm.markAllAsTouched();
    }
  }

}
