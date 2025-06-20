import { Component, input } from '@angular/core';

@Component({
  selector: 'error-component-medical-records',
  imports: [],
  templateUrl: './error-component-medical-records.component.html',
})
export class ErrorComponentMedicalRecordsComponent {
  medicalErrors = input.required()
  medicalMessage = input.required()
}
