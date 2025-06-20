export interface GetAppointmentsDto {
  id: number;
  patientsId: number;
  specialty: string;
  status: string;
  scheduledAt: Date;
  createdAt: Date;
  updatedAt: Date;
  patient: Patient;
}

export interface Patient {
  id: number;
  name: string;
  last_name: string;
  dni: string;
  date_born: Date;
  gender: string;
  phone: string;
  email: string;
  country: string;
  createdAt: Date;
}
