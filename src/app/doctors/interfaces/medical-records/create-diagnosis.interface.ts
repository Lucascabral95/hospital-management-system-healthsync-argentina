export interface CreateDiagnosisDto {
  doctorId: number;
  patientsId: number;
  reasonForVisit: string;
  diagnosis: string;
  treatment: string;
}

export interface ResponseCreateDiagnosis {
  id: number;
  doctorId: number;
  date: Date;
  reasonForVisit: string;
  diagnosis: string;
  treatment: string;
  createdAt: Date;
  updatedAt: Date;
  patientsId: number;
}
