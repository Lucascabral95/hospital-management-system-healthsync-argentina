import { Gender } from "./patients-get.interface";

export interface CreatePatientsDTO {
  dni: string;
  name: string;
  last_name: string;
  date_born: string;
  gender: Gender;
  phone: string;
  email: string;
  is_admitted?: boolean;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}
