type Category = 'ADMISSION' | "SECONDARY" | 'COMPLICATION' | 'COMORBIDITY' | 'DISCHARGE';
type Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface AddAndCreateDiagnosisDto {
  code: string;
  description: string;
  category: Category;
}
