import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';
import { JWTPayload } from '../../admin/interfaces/jwt-payload.interface';
import { HttpClient } from '@angular/common/http';
import { LoginDto, RegisterDto } from '../interfaces';
import { ServiceDoctor } from '../../doctors/service/service-doctor.service';

const TOKEN_LS_KEY = environment.localStorage;
const URL = environment.url_project

@Injectable({ providedIn: 'root' })
export default class ServiceAuth {
  router = inject(Router);
  http = inject(HttpClient)
  serviceDoctor = inject(ServiceDoctor)

  public getLocalStorage(): JWTPayload | null {
    const valueLocalStorage = localStorage.getItem(TOKEN_LS_KEY);
    if (!valueLocalStorage) return null;

    const parts = valueLocalStorage.split('.');
    if (parts.length !== 3) return null;

    const payloadBase64 = parts[1];
    try {
      const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(payloadJson) as JWTPayload;
    } catch {
      return null;
    }
  }

  public getTokenJwt(): string {
    return localStorage.getItem(TOKEN_LS_KEY)!;
  }

  public IsAuthenticated(): boolean {
    const payload = this.getLocalStorage();

    if (!payload) return false;

    return payload?.role === 'ADMIN' || payload?.role === 'DOCTOR';
  }

  public rolePersonal(): string | undefined | null {
    const role = this.getLocalStorage()?.role;

    return role;
  }

  public idPersonal(): number {
    const id = this.getLocalStorage()?.id;

    return id!;
  }

  public logout(): void {
    localStorage.removeItem(TOKEN_LS_KEY);
    this.router.navigate(['/auth']);
  }

  public login(loginDto: LoginDto) {
    return this.http.post<LoginDto>(`${URL}/auth/login`, {
      ...loginDto
    })
  }

  public register(registerDto: RegisterDto) {
    return this.http.post<RegisterDto>(`${URL}/auth`, {
      ...registerDto
    })
  }

}
