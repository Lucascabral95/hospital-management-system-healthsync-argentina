import { Component, inject, input, output, signal } from '@angular/core';
import { GetMedicalRecordsPatientdByID } from '../../../../patients/interfaces/get-medical-records-patients-by-id.interface';
import { DatePipe } from '@angular/common';
import { ErrorComponentMedicalRecordsComponent } from "../../../../patients/components/medical-records-patients/medical-records-error-component/error-component-medical-records/error-component-medical-records.component";
import { GetMedicalRecordsDoctorByID } from '../../../../doctors/interfaces/medical-records/get-medical-records-doctor-by-id.interface';
import { RouterLink } from '@angular/router';
import { ModalCreateDiagnosisComponentComponent } from "../../../../patients/components/modal-create-diagnosis/modal-create-diagnosis-component/modal-create-diagnosis-component.component";
import ServiceAuth from '../../../../auth/service/auth.service';

type Type = 'patient' | 'doctor' | '';

@Component({
  selector: 'app-body-detail-component',
  imports: [DatePipe, ErrorComponentMedicalRecordsComponent, RouterLink, ModalCreateDiagnosisComponentComponent],
  templateUrl: './body-detail-component.component.html',
})
export class BodyDetailComponentComponent {
  title = input<string>('');
  medicalRecordsForPatient = input<GetMedicalRecordsPatientdByID[]>([]);
  doctorOrPatient = input.required<Type>();
  medicalRecordsForDoctor = input<GetMedicalRecordsDoctorByID[]>([]);
  authService = inject(ServiceAuth);

  isOpenModalCreateDiagnosis = signal<boolean>(false)
  rolePersonal = signal<string | null | undefined>(this.authService.rolePersonal())
  /// -----

  inputSearch = output<string>()

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value
    this.inputSearch.emit(value)
  }

  sortedDiagnosis = output<string>()

  onChangeDiagnosis(event: Event) {
    const value = (event.target as HTMLSelectElement).value
    return this.sortedDiagnosis.emit(value)
  }

  formatDiagnosis(text: string) {
    if (!text) return;
    const trimmedText = text.replace(/^\n+|\n+$/g, '');
    const unifiedLineBreaks = trimmedText.replace(/\n{2,}/g, '\n');

    return unifiedLineBreaks.replace(/\n/g, '<br>');
  }
}

