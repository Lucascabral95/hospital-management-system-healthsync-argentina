export interface GetPatients {
  totalPages: number;
  page: number;
  total: number;
  data: DataPatient[];
}

export interface DataPatient {
  id: number;
  dni: string;
  name: string;
  last_name: string;
  date_born: string;
  gender: Gender;
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

export enum Gender {
  Female = "FEMALE",
  Male = "MALE",
}
