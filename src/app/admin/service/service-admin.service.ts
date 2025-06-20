import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { AllResourceCount } from '../interfaces/all-resources-count.interface';

const URL = environment.url_project

@Injectable({
  providedIn: 'root'
})
export class ServiceAdminService {
  private http = inject(HttpClient)

  private cache = new Map<string, AllResourceCount>()

  public getAllCountResource(): Observable<AllResourceCount> {
    if (this.cache.has('count')) {
      return new Observable(observer => {
        observer.next(this.cache.get('count')!)
        observer.complete()
      })
    }

    return this.http.get<AllResourceCount>(`${URL}/doctors/dashboard/resources`).pipe(
      tap(res => this.cache.set('count', res))
    )
  }

}
