import { Component, EventEmitter, Output } from '@angular/core';
@Component({
  selector: 'create-appointment-component',
  standalone: true,
  template: '' // sin template para no iterar nada
})
class CreateAppointmentStub {
  @Output() close = new EventEmitter<boolean>();
}

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import AppAppointmentsComponent from '../../appointments/pages/app-appointments/app-appointments.component';
import ServiceAppointments from '../../appointments/service/appointments-service.service';
import { PatientsService } from './patients-service.service';
import { CreateAppointmentComponentComponent } from '../../appointments/components/create-appointment-component/create-appointment-component/create-appointment-component.component';

describe('AppAppointmentsComponent (con stub de modal)', () => {
  let fixture: ComponentFixture<AppAppointmentsComponent>;

  const appointmentsMock = jasmine.createSpyObj('ServiceAppointments', ['specialties']);
  appointmentsMock.appointmentsWebSocket = signal<any[]>([]);
  appointmentsMock.socketError = signal<string | null>(null);
  appointmentsMock.specialties.and.returnValue(of([]));

  const patientsMock = { getDataPatientForAppointment: jasmine.createSpy().and.returnValue(of({})) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppAppointmentsComponent, RouterTestingModule]
    });

    TestBed.overrideComponent(AppAppointmentsComponent, {
      remove: { imports: [CreateAppointmentComponentComponent] },
      add: { imports: [CreateAppointmentStub] }
    });

    TestBed.overrideProvider(ServiceAppointments, { useValue: appointmentsMock });
    TestBed.overrideProvider(PatientsService, { useValue: patientsMock });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(AppAppointmentsComponent);
    fixture.detectChanges();
  });

  it('abre el modal (flag en true)', fakeAsync(() => {
    const btns = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    const newBtn = btns.find(b => b.textContent?.includes('Nueva cita') || b.querySelector('span')?.textContent?.includes('Nueva cita'));
    newBtn!.click();
    fixture.detectChanges();
    tick(0);
    expect(fixture.componentInstance.isOpenModalCreateAppointment()).toBeTrue();
  }));
});
