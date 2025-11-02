import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import DoctorDetailComponentComponent from './doctor-detail-component.component';
import { ServiceDoctor } from '../../service/service-doctor.service';
import ServiceAuth from '../../../auth/service/auth.service';

describe('DoctorDetailComponentComponent', () => {
  let fixture: ComponentFixture<DoctorDetailComponentComponent>;
  let component: DoctorDetailComponentComponent;

  const qp$ = new BehaviorSubject(convertToParamMap({ id: '1' }));

  const serviceDoctorMock: any = {
    getDoctorById: jasmine.createSpy('getDoctorById').and.returnValue(
      of({
        id: 1,
        full_name: 'Dr Demo',
        email: 'demo@demo.com',
        password: '',
        role: 'DOCTOR',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        Doctor: [{ id: 1, specialty: 'Clinician', licenceNumber: 123, createdAt: new Date(), updatedAt: new Date(), authId: 1 }],
      })
    ),
    getMedicalRecordsOfDoctorById: jasmine
      .createSpy('getMedicalRecordsOfDoctorById')
      .and.returnValue(of([])),
  };

  const authServiceMock: any = {
    idPersonal: () => 1,
    rolePersonal: () => 'ADMIN',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorDetailComponentComponent, RouterTestingModule],
      providers: [
        { provide: ServiceDoctor, useValue: serviceDoctorMock },
        { provide: ServiceAuth, useValue: authServiceMock },
        { provide: ActivatedRoute, useValue: { queryParamMap: qp$.asObservable() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorDetailComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render personal info title', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent || '';
    expect(text).toContain('Información personal');
  });
});

