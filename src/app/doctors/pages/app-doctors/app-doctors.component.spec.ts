import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import DoctorsComponent from './app-doctors.component';
import { ServiceDoctor } from '../../service/service-doctor.service';
import { of } from 'rxjs';
import { Doctors, Role } from '../../interfaces/doctors.interface';

describe('DoctorsComponent', () => {
  let fixture: ComponentFixture<DoctorsComponent>;
  let component: DoctorsComponent;

  const mockDoctors: Doctors = {
    totalPage: 1,
    page: 1,
    total: 1,
    data: [
      {
        id: 1,
        full_name: 'Alice Smith',
        email: 'a@a.com',
        password: '',
        role: Role.Doctor,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        Doctor: [{ id: 1, specialty: 'Clinician' as any, licenceNumber: 123, createdAt: new Date(), updatedAt: new Date(), authId: 1 }],
      },
    ],
  };

  const serviceDoctorMock: any = {
    columnsDoctors: ['Nombre completo', 'Rol', 'Estado', 'Especialidad', 'Licencia', 'Modificar'],
    getDoctors: jasmine.createSpy('getDoctors').and.returnValue(of(mockDoctors)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsComponent, RouterTestingModule],
      providers: [{ provide: ServiceDoctor, useValue: serviceDoctorMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render table-doctors-component when data loads', fakeAsync(() => {
  fixture.detectChanges();

  tick();
  fixture.detectChanges();

  const table = fixture.nativeElement.querySelector('table-doctors-component');
  expect(table).toBeTruthy();
}));

  it('should filter doctors by search', () => {
    component.onSearch('alice');
    fixture.detectChanges();
    expect(component.filtered().length).toBe(1);
  });
});

