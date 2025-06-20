export interface DoctorDetail {
  id: number;
  full_name: string;
  email: string;
  password: string;
  role: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
  Doctor: Doctor[];
}

export interface Doctor {
  id: number;
  specialty: string;
  licenceNumber: number;
  createdAt: Date;
  updatedAt: Date;
  authId: number;
}
