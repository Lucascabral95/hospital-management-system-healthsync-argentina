import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { GetPatients } from '../interfaces/patients-get.interface';
import { UpdatePatientsDTO } from '../interfaces/patients-update.interface';
import { PatientsByIDDto } from '../interfaces/patients-by-id.interface';
import { CreatePatientsDTO } from '../interfaces/patients-create.interface';
import { ResponsePostPatientDto } from '../interfaces/response-post.interface';
import { GetMedicalRecordsPatientdByID } from '../interfaces/get-medical-records-patients-by-id.interface';
import { CreateDiagnosisDto, ResponseCreateDiagnosisDto } from '../interfaces/medical-records/create-diagnosis.interface';
import { SelectPatientsDto } from '../../interment/interfaces/select-patients.interface';
import { GetPatientForNameLastNameDto } from '../interfaces/search-patients/get-patient-for-name-last-name.interface';
import { GetPatientAppointmentDto } from '../interfaces/get-patient-appointment.interface';
import { GetDataPatientAppointmentDto } from '../../appointments/interfaces/get-patient-appointment.interface';

const URL = environment.url_project;
const LIMIT = environment.limit

@Injectable({
  providedIn: 'root'
})
export class PatientsService {
  private http = inject(HttpClient)

  public patients = ["Nombre completo", "DNI", "Teléfono", "Email", "Fecha de nacimiento"];

  private cachePatients = new Map<string, GetPatients>();

  getPatients(page?: number, sortedBy?: string, order?: string): Observable<GetPatients> {
    const cacheKey = `${page ?? 1}-${sortedBy ?? 'name'}-${LIMIT}-${order ?? 'desc'}`

    if (this.cachePatients.has(cacheKey)) {
      return new Observable<GetPatients>(observer => {
        observer.next(this.cachePatients.get(cacheKey)!);
        observer.complete()
      })
    }

    return this.http.get<GetPatients>(`${URL}/patients`, {
      params: {
        page: page ?? 1,
        sortedBy: sortedBy ?? 'name',
        limit: LIMIT,
        order: order ?? 'desc'
      }
    }).pipe(
      tap(res => this.cachePatients.set(cacheKey, res))
    );
  }

  getPatientsWithoutCache(): Observable<GetPatients> {
    return this.http.get<GetPatients>(`${URL}/patients`, {
      params: {
        limit: 100000,
      }
    })
  }

  onClearPatientsCache() {
    this.cachePatients.clear()
  }

  cachePatientsDetail = new Map<string, PatientsByIDDto>()

  getPatientsById(id: number): Observable<PatientsByIDDto> {
    const cacheKey = id.toString()
    if (this.cachePatientsDetail.has(cacheKey)) {
      return new Observable<PatientsByIDDto>(observer => {
        observer.next(this.cachePatientsDetail.get(cacheKey)!),
          observer.complete()
      })
    }

    return this.http.get<PatientsByIDDto>(`${URL}/patients/${+id}`).pipe(
      tap(res => this.cachePatientsDetail.set(id.toString(), res))
    )
  }

  updatePatientById(id: number, patient: UpdatePatientsDTO): Observable<UpdatePatientsDTO> {
    return this.http.patch<UpdatePatientsDTO>(`${URL}/patients/${+id}`, patient);
  }

  onClearPatientByIdCache(id: number) {
    const cacheKey = id.toString();
    if (this.cachePatientsDetail.has(cacheKey)) {
      this.cachePatientsDetail.delete(cacheKey);
    }
  }

  createPatient(patient: CreatePatientsDTO) {
    return this.http.post<ResponsePostPatientDto>(`${URL}/patients`, patient).pipe(
      tap(() => this.onClearPatientsCache()),
      tap(() => this.onClearPatientsCache()),
    )
  }

  medicalRecordOfPatientCache = signal<GetMedicalRecordsPatientdByID[]>([])

  getMedicalRecordsPatientsById(id: number, order?: string) {
    return this.http.get<GetMedicalRecordsPatientdByID[]>(`${URL}/medical-records/${+id}/patient`, {
      params: {
        order: order ?? 'desc',
      }
    }).pipe(
      tap(res => this.medicalRecordOfPatientCache.set(res)),
    )
  }

  createDiagnosis(createDiagnosisDto: CreateDiagnosisDto) {
    return this.http.post<ResponseCreateDiagnosisDto>(`${URL}/medical-records`, createDiagnosisDto).pipe(
      tap(res => {
        this.getMedicalRecordsPatientsById(createDiagnosisDto.patientsId).subscribe();
      })
    );
  }

  selectPatientsOptions = signal<SelectPatientsDto[]>([])

  getPatientsWithSelect(): Observable<SelectPatientsDto[]> {
    return this.http.get<SelectPatientsDto[]>(`${URL}/patients/select`).pipe(
      tap(res => this.selectPatientsOptions.set(res)),
    )
  }

  addDiagnosisPatient(diagnosis: CreateDiagnosisDto) {
    return this.http.post<ResponseCreateDiagnosisDto>(`${URL}/medical-records`, diagnosis).pipe(
      tap(res => console.log(res)),
    )
  }

  searchPatients = signal<GetPatientForNameLastNameDto[]>([])

  searchPatientsByNameOrLastName(patient: string): Observable<GetPatientForNameLastNameDto[]> {
    return this.http.get<GetPatientForNameLastNameDto[]>(`${URL}/patients/search`, {
      params: {
        patient: patient,
      }
    })
  }

  getDataPatientForAppointment(dni: string): Observable<GetDataPatientAppointmentDto> {
    return this.http.get<GetDataPatientAppointmentDto>(`${URL}/patients/dni/${dni}`)
  }
}
