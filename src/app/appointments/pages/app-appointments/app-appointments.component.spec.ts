import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import AppAppointmentsComponent from './app-appointments.component';
import ServiceAppointments from '../../service/appointments-service.service';

import TableAppointmentComponent from '../../components/table-appointments/table-appointment/table-appointment.component';
import ErrorRequestComponentComponent from '../../../shared/components/errors/error-request-component/error-request-component.component';
import { CreateAppointmentComponentComponent } from '../../components/create-appointment-component/create-appointment-component/create-appointment-component.component';

type Patient = { name: string; last_name: string };
type Appointment = { status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'; patient?: Patient };

describe('AppAppointmentsComponent (shallow)', () => {
  let fixture: ComponentFixture<AppAppointmentsComponent>;
  let component: AppAppointmentsComponent;

  const appointmentsSig = signal<Appointment[]>([]);
  const socketErrorSig = signal<string | null>(null);

  const serviceMock: Partial<Record<keyof ServiceAppointments, any>> = {
    appointmentsWebSocket: jasmine.createSpy('appointmentsWebSocket').and.callFake(() => appointmentsSig()),
    socketError: jasmine.createSpy('socketError').and.callFake(() => socketErrorSig()),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppAppointmentsComponent],
      providers: [{ provide: ServiceAppointments, useValue: serviceMock }],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(AppAppointmentsComponent, {
        remove: {
          imports: [TableAppointmentComponent, ErrorRequestComponentComponent, CreateAppointmentComponentComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AppAppointmentsComponent);
    component = fixture.componentInstance;
  });

  function textContent(el: Element | null | undefined) {
    return el ? (el.textContent ?? '').trim() : '';
  }

  it('debe crear el componente', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
    flush();
  }));

  it('debe mostrar loading cuando no hay citas y ocultarlo cuando llegan', fakeAsync(() => {
    appointmentsSig.set([]);
    socketErrorSig.set(null);

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.loading.loading-spinner')).toBeTruthy();

    appointmentsSig.set([
      { status: 'PENDING' },
      { status: 'IN_PROGRESS' },
      { status: 'COMPLETED' },
    ]);

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.loading.loading-spinner')).toBeFalsy();
    flush();
  }));

  it('debe calcular contadores por estado y total cuando no hay error de socket', fakeAsync(() => {
    appointmentsSig.set([
      { status: 'PENDING' },
      { status: 'PENDING' },
      { status: 'IN_PROGRESS' },
      { status: 'COMPLETED' },
      { status: 'COMPLETED' },
      { status: 'COMPLETED' },
    ]);
    socketErrorSig.set(null);

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const statValues = fixture.debugElement
      .queryAll(By.css('.stat-value'))
      .map(de => textContent(de.nativeElement as HTMLElement));

    expect(statValues[0]).toBe('2');
    expect(statValues[1]).toBe('1');
    expect(statValues[2]).toBe('3');
    expect(statValues[3]).toBe(String(2 + 1 + 3));
    flush();
  }));

  it('debe mostrar "⚠️ Offline" y el error-request-component cuando hay error de socket', fakeAsync(() => {
    appointmentsSig.set([]);
    socketErrorSig.set('WebSocket desconectado');

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const statValues = fixture.debugElement
      .queryAll(By.css('.stat-value'))
      .map(de => textContent(de.nativeElement as HTMLElement));

    expect(statValues.every(t => t.startsWith('⚠️ Offline'))).toBeTrue();

    expect(fixture.nativeElement.querySelector('error-request-component')).toBeTruthy();
    flush();
  }));

  it('debe mostrar "Último paciente llamado" con el último de En atención', fakeAsync(() => {
    appointmentsSig.set([
      { status: 'IN_PROGRESS', patient: { name: 'Ana', last_name: 'García' } },
      { status: 'IN_PROGRESS', patient: { name: 'Luis', last_name: 'Pérez' } },
    ]);
    socketErrorSig.set(null);

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const headings = fixture.debugElement.queryAll(By.css('h2.text-primary'));
    const targetH2 = headings.find(h =>
      textContent(h.nativeElement as HTMLElement).includes('Último paciente llamado')
    );
    const pEl = targetH2?.nativeElement?.parentElement?.parentElement?.querySelector('p');
    const finalText = textContent(pEl);

    expect(finalText).toContain('Luis');
    expect(finalText).toContain('Pérez');
    flush();
  }));

  it('debe abrir el modal al clickear "Nueva cita" y renderizar la etiqueta', fakeAsync(() => {
    appointmentsSig.set([]);
    socketErrorSig.set(null);

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const btnNueva: HTMLButtonElement = fixture.nativeElement.querySelector('button.btn-primary');
    btnNueva.click();
    fixture.detectChanges();

    expect(component.isOpenModalCreateAppointment()).toBeTrue();

    expect(fixture.nativeElement.querySelector('create-appointment-component')).toBeTruthy();
    flush();
  }));

  it('muestra textos de listas vacías cuando loading=false y sin errores', fakeAsync(() => {
    appointmentsSig.set([]);
    socketErrorSig.set(null);

    fixture.detectChanges();
    tick();

    component.loading.set(false);
    fixture.detectChanges();

    const wholeText = textContent(fixture.nativeElement as HTMLElement);
    expect(wholeText.includes('No hay citas pendientes')).toBeTrue();
    expect(wholeText.includes('No hay pacientes en atención')).toBeTrue();
    expect(wholeText.includes('No hay citas completadas')).toBeTrue();
    flush();
  }));
});
