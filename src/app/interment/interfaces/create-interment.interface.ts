export type Category = 'ADMISSION' | "SECONDARY" | 'COMPLICATION' | 'COMORBIDITY' | 'DISCHARGE';
export type Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface DiagnosisDto {
  code: string;
  description: string;
  category?: Category;
}

export interface CreateIntermentDto {
  doctorId: number;
  patientId: number;
  dischargeDate?: Date;
  status?: Status;
  diagnosis?: DiagnosisDto[];
}
