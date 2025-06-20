import { Component, effect, inject, input, signal } from '@angular/core';
import { ErrorComponentMedicalRecordsComponent } from "../../../../patients/components/medical-records-patients/medical-records-error-component/error-component-medical-records/error-component-medical-records.component";
import { BodyDetailComponentComponent } from "../../../../shared/components/body-detail-component/body-detail-component/body-detail-component.component";
import { ServiceDoctor } from '../../../service/service-doctor.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GetMedicalRecordsDoctorByID } from '../../../interfaces/medical-records/get-medical-records-doctor-by-id.interface';

@Component({
  selector: 'app-medical-records-doctor-component',
  imports: [ErrorComponentMedicalRecordsComponent, BodyDetailComponentComponent],
  templateUrl: './medical-records-doctor-component.component.html',
})
export class MedicalRecordsDoctorComponentComponent {
  serviceDoctor = inject(ServiceDoctor)
  doctorId = input.required<number>()

  loadingMedicalRecord = signal<boolean>(true)
  medicalErrors = signal<HttpErrorResponse | null>(null)

  sortedDiagnosis = signal<string>('desc')

  constructor() {
    effect(() => {
      const id = this.doctorId()
      const order = this.sortedDiagnosis()

      if (id) {
        this.serviceDoctor.getMedicalRecordsOfDoctorById(id, order).subscribe({
          next: (res) => {
            this.loadingMedicalRecord.set(false)
            this.filteredMedicalRecords.set(res)
          },
          error: (err: HttpErrorResponse) => {
            this.loadingMedicalRecord.set(false)
            this.medicalErrors.set(err)
            console.log(err)
          }
        })
      } else {
        return
      }
    })
  }

  filteredMedicalRecords = signal<GetMedicalRecordsDoctorByID[]>([])

  onSearchInput(value: string) {
    const search = value.trim().toLocaleLowerCase();

    if (!search) {
      this.filteredMedicalRecords.set(this.serviceDoctor.medicalRecordOfDoctor())
      return
    }

    const filteredRecords = this.serviceDoctor.medicalRecordOfDoctor().filter(record => {
      const patientName = record.Patients.name.trim().toLowerCase();
      const patientLastName = record.Patients.last_name.trim().toLowerCase();

      return patientName.includes(search) || patientLastName.includes(search);
    });

    this.filteredMedicalRecords.set(filteredRecords)
  }
}

