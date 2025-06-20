export interface JWTPayload {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  iat: number;
  exp: number;
}
