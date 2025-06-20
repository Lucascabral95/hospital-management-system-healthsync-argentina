import { Component, effect, inject, input, signal } from '@angular/core';
import { PatientsService } from '../../../service/patients-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BodyDetailComponentComponent } from "../../../../shared/components/body-detail-component/body-detail-component/body-detail-component.component";
import { ErrorComponentMedicalRecordsComponent } from "../medical-records-error-component/error-component-medical-records/error-component-medical-records.component";
import { GetMedicalRecordsPatientdByID } from '../../../interfaces/get-medical-records-patients-by-id.interface';

@Component({
  selector: 'medical-records-patients-component',
  imports: [ErrorComponentMedicalRecordsComponent, BodyDetailComponentComponent],
  templateUrl: './medica-records-patients-component.component.html',
})
export class MedicaRecordsPatientsComponentComponent {
  servicePatients = inject(PatientsService)
  patientId = input.required<number>()

  loadingMedicalRecords = signal<boolean>(true)
  medicalErrors = signal<HttpErrorResponse | null>(null)
  sortedDiagnosis = signal<string>('desc')

  constructor() {
    effect(() => {
      const id = this.patientId()
      const order = this.sortedDiagnosis()

      if (id) {
        this.servicePatients.getMedicalRecordsPatientsById(id, order).subscribe({
          next: (res) => {
            this.loadingMedicalRecords.set(false)
            this.patientsFiltered.set(res)
          },
          error: (err: HttpErrorResponse) => {
            this.loadingMedicalRecords.set(false)
            this.medicalErrors.set(err)
            console.log(err)
          }
        })
      } else {
        return
      }
    })
  }

  patientsFiltered = signal<GetMedicalRecordsPatientdByID[]>([])

  onSearchInput(value: string) {
    const search = value.trim().toLocaleLowerCase();

    if (!search) {
      this.patientsFiltered.set(this.servicePatients.medicalRecordOfPatientCache())
      return
    }

    const filteredRecords = this.servicePatients.medicalRecordOfPatientCache().filter(record => {
      const diagnosis = record.diagnosis.trim().toLowerCase();
      const treatment = record.treatment.trim().toLowerCase();

      return diagnosis.includes(search) || treatment.includes(search);
    });

    this.patientsFiltered.set(filteredRecords)
  }


}
