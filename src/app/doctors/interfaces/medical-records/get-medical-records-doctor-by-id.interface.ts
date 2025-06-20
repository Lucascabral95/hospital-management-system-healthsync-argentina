export interface GetMedicalRecordsDoctorByID {
  id: number;
  doctorId: number;
  date: Date;
  reasonForVisit: string;
  diagnosis: string;
  treatment: string;
  createdAt: Date;
  updatedAt: Date;
  patientsId: number;
  Doctor: Doctor;
  Patients: Patients;
}

interface Doctor {
  id: number;
  specialty: string;
  licenceNumber: number;
  auth: Auth;
}

interface Auth {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface Patients {
  id: number;
  dni: string;
  name: string;
  last_name: string;
  date_born: Date;
  gender: string;
  country: string;
}
