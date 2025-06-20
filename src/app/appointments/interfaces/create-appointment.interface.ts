import { Specialties } from "./specialties.enum";

type Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface CreateAppointmentDto {
  patientsId: number;

  specialty?: Specialties;
  status?: Status;
  scheduledAt?: Date;
}

export interface ResponseCreateAppointmentDto {
  id: number;
  patientsId: number;
  specialty: string;
  status: string;
  scheduledAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
