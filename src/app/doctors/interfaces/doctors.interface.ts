export interface Doctors {
  totalPage: number;
  page: number;
  total: number;
  data: Data[];
}

export interface Data {
  id: number;
  full_name: string;
  email: string;
  password: string;
  role: Role;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
  Doctor: Doctor[];
}

export interface Doctor {
  id: number;
  specialty: Specialty;
  licenceNumber: number;
  createdAt: Date;
  updatedAt: Date;
  authId: number;
}

export enum Specialty {
  Clinician = "Clinician",
  MedicoClinicoPasante = "Medico Clinico - Pasante",
}

export enum Role {
  Doctor = "DOCTOR",
  Admin = "ADMIN",
  Patient = "PATIENT",
}
