export interface GetPatientsOfDoctorByID {
  id: number;
  specialty: string;
  licenceNumber: number;
  createdAt: Date;
  updatedAt: Date;
  authId: number;
  medicalRecords: MedicalRecord[];
}

export interface MedicalRecord {
  id: number;
  doctorId: number;
  date: Date;
  reasonForVisit: string;
  diagnosis: string;
  treatment: string;
  createdAt: Date;
  updatedAt: Date;
  patientsId: number;
  Patients: Patients;
}

export interface Patients {
  id: number;
  dni: string;
  name: string;
  last_name: string;
  date_born: Date;
  gender: string;
  phone: string;
  email: string;
  is_admitted: boolean;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}
