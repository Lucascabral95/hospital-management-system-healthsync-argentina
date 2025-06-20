export interface Patient {
  id: number;
  dni: string;
  name: string;
  last_name: string;
  date_born: string;
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
