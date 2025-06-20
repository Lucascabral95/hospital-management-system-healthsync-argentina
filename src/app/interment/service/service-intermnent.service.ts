import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { GetInterments } from '../interfaces/interments.interface';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { FilterTypesInterments } from '../interfaces/interments-status.interface';
import { IntermentByIDDTO, Diagnosis } from '../interfaces/interment-by-id.interface';
import { Status, UpdateIntermentByIdDto } from '../interfaces/update-interment.interface';
import { CreateIntermentDto } from '../interfaces/create-interment.interface';
import { AddAndCreateDiagnosisDto } from '../interfaces/create-diagnosis.interface';
import { PostDiagnosisDto } from '../interfaces/response-post-diagnosis.interface';
import { SelectPatientsDto } from '../interfaces/select-patients.interface';

const URL = environment.url_project

@Injectable({
  providedIn: 'root'
})
export class ServiceIntermnentService {
  private http = inject(HttpClient)

  // ---------- Interments ----------
  private cacheInterments = new Map<string, GetInterments>()

  public getInterments(page?: number, sortedBy?: string, order?: string) {
    const cacheKey = `${page ?? 1}-${sortedBy ?? "createdAt"}-${order ?? 'desc'}`

    if (this.cacheInterments.has(cacheKey)) {
      return new Observable<GetInterments>(observer => {
        observer.next(this.cacheInterments.get(cacheKey)!),
          observer.complete()
      })
    }

    return this.http.get<GetInterments>(`${URL}/interment`, {
      params: {
        page: page ?? 1,
        sortedBy: sortedBy ?? "createdAt",
        order: order ?? 'desc',
        limit: 10000,
      }
    }).pipe(
      tap(res => this.cacheInterments.set(cacheKey, res)),
    )
  }

  filterStatus: FilterTypesInterments[] = [
    {
      label: 'Finalizado',
      status: 'COMPLETE'
    }, {
      label: 'En espera',
      status: 'PENDING'
    }, {
      label: 'En curso',
      status: 'IN_PROGRESS'
    }
  ]

  clearGetInterments() {
    this.cacheInterments.clear()
  }

  // ---------- Interment By ID ----------
  private cacheIntermentById = new Map<string, IntermentByIDDTO>()
  intermentGetByID = signal<IntermentByIDDTO | null>(null)
  loadingIntermentById = signal<boolean>(true)
  errorRequest = signal<HttpErrorResponse | null>(null)

  getIntermentById(id: number): Observable<IntermentByIDDTO> {
    const cacheKey = id.toString()
    const data = this.cacheIntermentById.get(cacheKey)

    if (data) {
      this.intermentGetByID.set(data)
      return of(data)
    }

    this.loadingIntermentById.set(true)

    if (this.cacheIntermentById.has(cacheKey)) {
      return new Observable<IntermentByIDDTO>(observer => {
        observer.next(this.cacheIntermentById.get(cacheKey)!),
          observer.complete()
      })
    }

    return this.http.get<IntermentByIDDTO>(`${URL}/interment/${+id}`).pipe(
      tap(res => {
        this.cacheIntermentById.set(cacheKey, res)
        this.intermentGetByID.set(res)
        this.loadingIntermentById.set(false)
      }),
      catchError((error: HttpErrorResponse) => {
        this.loadingIntermentById.set(false)
        this.errorRequest.set(error)
        return throwError(() => error);
      })
    )
  }

  updateIntermentById(id: number, updateInterment: UpdateIntermentByIdDto) {
    return this.http.patch<UpdateIntermentByIdDto>(`${URL}/interment/${+id}`, updateInterment)
  }

  updateIntermentStatusById(id: number, statusInterment: Status) {
    return this.http.patch(`${URL}/interment/${+id}/${statusInterment}`, {}).pipe(
      tap(() => this.onClearIntermentByIdCache(id)),
      tap(() => this.clearGetInterments())
    );
  }

  onClearIntermentByIdCache(id: number) {
    const cacheKey = id.toString()
    if (this.cacheIntermentById.has(cacheKey)) {
      this.cacheIntermentById.delete(cacheKey)
    }
  }

  createInterment(createIntermentDto: CreateIntermentDto) {
    return this.http.post<CreateIntermentDto>(`${URL}/interment`, createIntermentDto)
  }

  // ----- add diagnosis ----
  addDiagnosis(id: number, diagnosis: AddAndCreateDiagnosisDto) {
    return this.http.post<PostDiagnosisDto>(`${URL}/interment/diagnosis/${+id}`, diagnosis).pipe(
      tap(() => this.onClearIntermentByIdCache(id)),
      tap((response) => this.intermentGetByID.update(prev => {
        if (!prev) return prev
        const newDiagnosis: Diagnosis = {
          id: response.createdDiagnosis.id,
          date: response.createdDiagnosis.createdAt,
          intermentId: id,
          code: diagnosis.code,
          description: diagnosis.description,
          category: diagnosis.category,
        };
        return { ...prev, Diagnosis: [...prev.Diagnosis, newDiagnosis] }
      }))
    )
  }

}


