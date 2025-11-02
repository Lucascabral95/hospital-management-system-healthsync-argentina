import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppDashboardComponent } from './app-dashboard.component';
import ServiceAuth from '../../../auth/service/auth.service';
import { PatientsService } from '../../../patients/service/patients-service.service';

describe('AppDashboardComponent', () => {
  let fixture: ComponentFixture<AppDashboardComponent>;
  let component: AppDashboardComponent;

  const serviceAuthMock: any = {
    getLocalStorage: () => ({ id: 1, full_name: 'User Demo', role: 'ADMIN' }),
    rolePersonal: () => 'ADMIN',
    logout: jasmine.createSpy('logout'),
  };

  beforeEach(async () => {
    // ensure initial dom attribute has some value
    document.documentElement.setAttribute('data-theme', 'light');

    await TestBed.configureTestingModule({
      imports: [AppDashboardComponent, RouterTestingModule],
      providers: [
        { provide: ServiceAuth, useValue: serviceAuthMock },
        { provide: PatientsService, useValue: { searchPatientsByNameOrLastName: () => ({ subscribe: () => {} }) } as any },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render some menu labels', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent || '';
    expect(text).toContain('Admin');
    expect(text).toContain('Mi Perfil');
  });

  it('should toggle dark mode and update data-theme attribute', () => {
    const before = document.documentElement.getAttribute('data-theme');
    component.toggleDarkMode();
    const after = document.documentElement.getAttribute('data-theme');
    expect(after).not.toBe(before);
  });

  it('should call logout from auth service', () => {
    const btn = (fixture.nativeElement as HTMLElement).querySelector('button');
    component.logout();
    expect(serviceAuthMock.logout).toHaveBeenCalled();
  });
});

