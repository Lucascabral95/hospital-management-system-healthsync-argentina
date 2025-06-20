export interface GetPatientAppointmentDto {
  totalPages: number;
  page: number;
  total: number;
  data: Data[];
}

interface Data {
  id: number;
  dni: string;
  name: string;
  last_name: string;
  date_born: string;
  gender: Gender;
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

enum Gender {
  Female = "FEMALE",
  Male = "MALE",
}
