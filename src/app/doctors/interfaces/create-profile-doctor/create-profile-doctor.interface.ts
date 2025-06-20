export interface CreateProfileDoctorDto {
  specialty: string;
  licenceNumber: number;
  authId: number;
}

export interface ResponseCreateProfileDoctorDto {
  id: number;
  specialty: string;
  licenceNumber: number;
  createdAt: Date;
  updatedAt: Date;
  authId: number;
}
