export interface GetInterments {
  totalPages: number;
  page: number;
  total: number;
  data: Data[];
}

export interface Data {
  id: number;
  doctorId: number;
  patientId: number;
  admissionDate: Date;
  dischargeDate: null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  Diagnosis: Diagnosis[];
  doctor: Doctor;
  patient: Patient;
}

export interface Diagnosis {
  id: number;
  code: string;
  description: string;
  category: string;
  date: Date;
  intermentId: number;
}

export interface Doctor {
  specialty: string;
  licenceNumber: number;
  id: number;
  auth: Auth;
}

export interface Auth {
  id: number;
  full_name: string;
  email: string;
}

export interface Patient {
  name: string;
  last_name: string;
  dni: string;
  date_born: Date;
  gender: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
}
