export interface PostDiagnosisDto {
  message: string;
  createdDiagnosis: CreatedDiagnosis;
}

export interface CreatedDiagnosis {
  id: number;
  doctorId: number;
  patientId: number;
  admissionDate: Date;
  dischargeDate: null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
