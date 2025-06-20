export interface GetDoctorsSelectDto {
  id: number;
  specialty: string;
  auth: Auth;
}

interface Auth {
  id: number;
  full_name: string;
}
