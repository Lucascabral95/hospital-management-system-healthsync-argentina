import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { Doctors } from '../interfaces/doctors.interface';
import { DoctorDetail } from '../interfaces/doctor-detail.interface';
import { PatchDoctor } from '../interfaces/doctor-update.interface';
import { GetPatientsOfDoctorByID } from '../interfaces/get-patients-of-doctor-by-id.interface';
import { GetMedicalRecordsDoctorByID } from '../interfaces/medical-records/get-medical-records-doctor-by-id.interface';
import { CreateDiagnosisDto, ResponseCreateDiagnosis } from '../interfaces/medical-records/create-diagnosis.interface';
import { GetDoctorsSelectDto } from '../interfaces/medical-records/select-doctors.interface';
import { GetDoctorAuthDto } from '../interfaces/get-doctor-auth.interface';
import { CreateProfileDoctorDto, ResponseCreateProfileDoctorDto } from '../interfaces/create-profile-doctor/create-profile-doctor.interface';

const URL = environment.url_project

@Injectable({
  providedIn: 'root'
})
export class ServiceDoctor {
  private http = inject(HttpClient)

  columnsDoctors = ["Nombre completo", "Rol", "Estado", "Especialidad", "Licencia", "Modificar"]

  private cacheDoctors = new Map<string, Doctors>()

  getDoctors(page?: number, limit?: number, sortedBy?: string, order?: string): Observable<Doctors> {
    const cacheKey = `${page ?? 1}-${limit ?? 10}-${sortedBy ?? 'full_name'}-${order ?? 'desc'}`;
    if (this.cacheDoctors.has(cacheKey)) {
      return new Observable<Doctors>(observer => {
        observer.next(this.cacheDoctors.get(cacheKey)!);
        observer.complete();
      });
    }

    return this.http.get<Doctors>(`${URL}/auth`, {
      params: {
        page: page ?? 1,
        limit: limit ?? 100,
        sortedBy: sortedBy ?? 'full_name',
        order: order ?? 'desc'
      }
    }).pipe(
      tap(res => this.cacheDoctors.set(cacheKey, res))
    );
  }

  // ----
  private cacheDoctorDetail = new Map<string, DoctorDetail>()

  getDoctorById(id: number): Observable<DoctorDetail> {
    const cacheKey = id.toString()
    if (this.cacheDoctorDetail.has(cacheKey)) {
      return new Observable<DoctorDetail>(observer => {
        observer.next(this.cacheDoctorDetail.get(cacheKey)!),
          observer.complete()
      })
    }

    return this.http.get<DoctorDetail>(`${URL}/auth/${+id}`).pipe(
      tap(res => this.cacheDoctorDetail.set(id.toString(), res))
    )
  }

  updateDoctorById(id: number, doctor: PatchDoctor): Observable<PatchDoctor> {
    return this.http.patch<PatchDoctor>(`${URL}/auth/${+id}`, doctor)
  }

  // --- find patients of a doctor ----
  patientsOfDoctorCache = new Map<string, GetPatientsOfDoctorByID>()

  getPatientsOfDoctorById(id: number): Observable<GetPatientsOfDoctorByID> {
    const cacheKey = id.toString()
    if (this.patientsOfDoctorCache.has(cacheKey)) {
      return new Observable<GetPatientsOfDoctorByID>(observer => {
        observer.next(this.patientsOfDoctorCache.get(cacheKey)!),
          observer.complete()
      })
    }

    return this.http.get<GetPatientsOfDoctorByID>(`${URL}/doctors/${+id}/patients`).pipe(
      tap(res => this.patientsOfDoctorCache.set(cacheKey, res))
    )
  }

  deleteCachePatientsOfDoctorById(id: number) {
    const cacheKey = id.toString()
    if (this.patientsOfDoctorCache.has(cacheKey)) {
      this.patientsOfDoctorCache.delete(cacheKey)
    }
  }

  medicalRecordOfDoctor = signal(<GetMedicalRecordsDoctorByID[]>[])

  getMedicalRecordsOfDoctorById(id: number, order?: string) {
    return this.http.get<GetMedicalRecordsDoctorByID[]>(`${URL}/medical-records/${+id}/doctor`, {
      params: {
        order: order ?? 'desc',
      }
    }).pipe(
      tap(res => this.medicalRecordOfDoctor.set(res)),
    )
  }

  // --- add diagnosis ---
  createDiagnosis(createDiagnosisDto: CreateDiagnosisDto) {
    return this.http.post<ResponseCreateDiagnosis>(`${URL}/medical-records`, createDiagnosisDto).pipe(
      tap(res => console.log(res)),
    )
  }

  /////////
  selectDoctorsOptions = signal<GetDoctorsSelectDto[]>([])

  getDoctorsWithSelect(): Observable<GetDoctorsSelectDto[]> {
    return this.http.get<GetDoctorsSelectDto[]>(`${URL}/doctors/select`).pipe(
      tap(res => this.selectDoctorsOptions.set(res)),
    )
  }

  //// Get data doctor for id jwt
  doctorIdAuth = signal<number | null>(null)

  getDoctorForIdJwt(id: number): Observable<GetDoctorAuthDto> {
    return this.http.get<GetDoctorAuthDto>(`${URL}/auth/${+id}`).pipe(
      tap(res => this.doctorIdAuth.set(res.Doctor[0].id)),
    )
  }

  /// create profile doctor
  createProfileDoctor(createProfileDoctor: CreateProfileDoctorDto) {
    return this.http.post<ResponseCreateProfileDoctorDto>(`${URL}/doctors`, {
      ...createProfileDoctor
    })
  }

}

