import { Component, inject, ResourceRef, signal } from '@angular/core';
import { MenuOptions } from '../../../shared/interfaces/menu.interface';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ServiceAdminService } from '../../service/service-admin.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { AllResourceCount } from '../../interfaces/all-resources-count.interface';
import ServiceAuth from '../../../auth/service/auth.service';
import { JWTPayload } from '../../interfaces/jwt-payload.interface';

@Component({
  selector: 'app-app-admin',
  imports: [RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './app-admin.component.html',
})
export default class AppAdminComponent {
  serviceAdmin = inject(ServiceAdminService);
  authService = inject(ServiceAuth)

  name = signal<JWTPayload | null>(this.authService.getLocalStorage());

  sections: MenuOptions[] = [
    { icon: 'fa-solid fa-user-tie', label: 'Doctores', subLabel: 'doctores', route: '/admin/doctors' },
    { icon: 'fa-solid fa-user-injured', label: 'Pacientes', subLabel: 'pacientes', route: '/admin/patients' },
    { icon: 'fas fa-bed', label: 'Internación', subLabel: 'internación', route: '/admin/interments' },
    { icon: 'fa-solid fa-calendar-check', label: 'citas médicas', subLabel: 'citas médicas', route: '/admin/appointments' },
  ];

  dataAllResource = signal<AllResourceCount>({
    totalDoctors: 0,
    totalPatients: 0,
    totalInterments: 0,
    totalAppointments: 0
  });

  resCount = rxResource({
    loader: () => this.serviceAdmin.getAllCountResource().pipe(
      tap(res => this.dataAllResource.set(res))
    )
  })
}
