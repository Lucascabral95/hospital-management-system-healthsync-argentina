export interface ResponseRegisterDto {
  id: number;
  full_name: string;
  email: string;
  password: string;
  role: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResponseRegisterErrorDto {
  message: string,
  error: string,
  statusCode: number
}
