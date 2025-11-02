import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import AppAdminComponent from './app-admin.component';
import { ServiceAdminService } from '../../service/service-admin.service';
import ServiceAuth from '../../../auth/service/auth.service';
import { of } from 'rxjs';

describe('AppAdminComponent', () => {
  let fixture: ComponentFixture<AppAdminComponent>;
  let component: AppAdminComponent;

  const adminServiceMock = {
    getAllCountResource: jasmine.createSpy('getAllCountResource').and.returnValue(
      of({ totalDoctors: 3, totalPatients: 10, totalInterments: 2, totalAppointments: 5 })
    ),
  };

  const authServiceMock = {
    getLocalStorage: jasmine.createSpy('getLocalStorage').and.returnValue({ full_name: 'Usuario Demo' }),
  } as Partial<ServiceAuth> as ServiceAuth;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppAdminComponent, RouterTestingModule],
      providers: [
        { provide: ServiceAdminService, useValue: adminServiceMock },
        { provide: ServiceAuth, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render greeting with user name', () => {
    expect(fixture.nativeElement.textContent).toContain('Bienvenido/a de nuevo, Usuario Demo');
  });

  it('should render counts from service', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Total de doctores');
    expect(text).toContain('Total de pacientes');
    expect(text).toContain('Total de internación');
    expect(text).toContain('Total de citas médicas');
  });
});

