export interface GetPatientForNameLastNameDto {
  id: number;
  dni: string;
  name: string;
  last_name: string;
  date_born: Date;
  gender: string;
  phone: string;
  email: string;
  is_admitted: boolean;
  createdAt: Date;
  updatedAt: Date;
  city: string;
  country: string;
  state: string;
  street: string;
  zip_code: string;
}
