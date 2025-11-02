import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import PatientAppointmentComponent from './patient-appointment.component';
import { PatientsService } from '../../../../patients/service/patients-service.service';
import ServiceAppointments from '../../../service/appointments-service.service';
import { of } from 'rxjs';

describe('PatientAppointmentComponent', () => {
  let fixture: ComponentFixture<PatientAppointmentComponent>;
  let component: PatientAppointmentComponent;

  const patientsServiceMock = {
    // Importante: siempre devolver un Observable en TODAS las llamadas del effect (incluida la inicial con '')
    getDataPatientForAppointment: jasmine.createSpy('getDataPatientForAppointment')
      .and.callFake((dni: string) => {
        if (!dni) {
          return of({ id: null, name: '', last_name: '', dni: '', date_born: new Date() });
        }
        return of({ id: 1, name: 'John', last_name: 'Doe', dni, date_born: new Date() });
      }),
  };

  const appointmentsServiceMock = {
    specialties: () => ['Clinician'],
    // Si en algún momento el componente hace .subscribe(), devuelve of(void 0) para evitar “subscribe of undefined”
    createAppointment: jasmine.createSpy('createAppointment').and.returnValue(of(void 0)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // PatientAppointmentComponent es standalone, se importa directamente
      imports: [PatientAppointmentComponent],
      providers: [
        { provide: PatientsService, useValue: patientsServiceMock },
        { provide: ServiceAppointments, useValue: appointmentsServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientAppointmentComponent);
    component = fixture.componentInstance;
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges(); // dispara el effect inicial con dni ''
    tick();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    flush();
  }));

  it('should submit when form valid and patient found', fakeAsync(() => {
    fixture.detectChanges(); // effect inicial con dni '' => id null
    tick();
    fixture.detectChanges();

    // Setear DNI válido para disparar el effect nuevamente
    component.dni.set('123');
    fixture.detectChanges();
    tick();               // resolver la llamada con dni '123'
    fixture.detectChanges();

    // Form válido
    component.myForm.setValue({ specialty: 'Clinician' });
    fixture.detectChanges();

    // Submit
    component.onSubmit();
    fixture.detectChanges();

    expect(appointmentsServiceMock.createAppointment).toHaveBeenCalled();

    // Avanzar el timeout interno (2500ms) para resetear señales/form
    tick(2500);
    fixture.detectChanges();

    expect(component.dni()).toBe('');
    expect(component.myForm.value).toEqual({ specialty: null });
    flush();
  }));
});
