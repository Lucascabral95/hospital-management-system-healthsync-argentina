import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ServiceDoctor } from '../../service/service-doctor.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DoctorDetail } from '../../interfaces/doctor-detail.interface';
import { catchError, of, tap } from 'rxjs';
import { PatchDoctor } from '../../interfaces/doctor-update.interface';

@Component({
  selector: 'modal-patch-doctor-component',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-patch-doctor-component.component.html',
})
export class ModalCrudComponentComponent {
  close = output<boolean>();
  fb = inject(FormBuilder);
  doctorService = inject(ServiceDoctor);
  isIDDoctor = input.required<number>();

  myForm = this.fb.group({
    full_name: ['', []],
    email: ['', []],
    role: ['', []],
    is_active: ['', []],
  });

  doctorArray = signal<DoctorDetail | null>(null);

  constructor() {
    effect(() => {
      const id = this.isIDDoctor();
      if (id) {
        const sub$ = this.doctorService.getDoctorById(id).pipe(
          tap((res) => {
            this.myForm.patchValue({
              full_name: res.full_name,
              email: res.email,
              role: res.role,
              is_active: res.is_active ? 'ACTIVE' : 'INACTIVE',
            });
          }),
          catchError((error: HttpErrorResponse) => {
            console.log(error);
            return of(null);
          })
        ).subscribe();

        return () => sub$.unsubscribe();
      } else {
        return;
      }
    });
  }

  onSubmit() {
    if (this.myForm.valid) {
      const patchDoctor: PatchDoctor = {
        full_name: this.myForm.value.full_name ?? '',
        email: this.myForm.value.email ?? '',
        role: this.myForm.value.role ?? '',
        is_active: this.myForm.value.is_active === 'ACTIVE',
      };

      this.doctorService.updateDoctorById(this.isIDDoctor(), patchDoctor).subscribe({
        next: (res) => {
          console.log(res);
          this.closeModal();
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
    } else {
      this.myForm.markAllAsTouched();
    }
  }

  closeModal() {
    this.close.emit(false);
  }
}
