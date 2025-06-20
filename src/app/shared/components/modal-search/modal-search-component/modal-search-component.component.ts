import { Component, effect, inject, output, signal } from '@angular/core';
import { PatientsService } from '../../../../patients/service/patients-service.service';
import { RouterLink } from '@angular/router';
import { GetPatientForNameLastNameDto } from '../../../../patients/interfaces/search-patients/get-patient-for-name-last-name.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'modal-search-component',
  imports: [RouterLink],
  templateUrl: './modal-search-component.component.html',
})
export default class ModalSearchComponentComponent {
  servicePatient = inject(PatientsService)
  searchPatients = signal<string>('')
  arrayPatients = signal<GetPatientForNameLastNameDto[]>([])
  loadingArray = signal<boolean>(false)

  constructor() {
    effect(() => {
      const currentPatient = this.searchPatients()
      if (!currentPatient) {
        this.arrayPatients.set([])
        return
      }

      this.loadingArray.set(true)

      this.servicePatient.searchPatientsByNameOrLastName(currentPatient).subscribe({
        next: (res) => {
          this.loadingArray.set(false)
          this.arrayPatients.set(res)
        },
        error: (err: HttpErrorResponse) => {
          console.log(err)
          this.loadingArray.set(false)
          this.arrayPatients.set([])
        }
      })
    })
  }

  onSearch(value: string) {
    this.searchPatients.set(value)
  }

  searchModal = output<boolean>()

  closeModal(value: boolean) {
    this.searchModal.emit(value)
  }
}
