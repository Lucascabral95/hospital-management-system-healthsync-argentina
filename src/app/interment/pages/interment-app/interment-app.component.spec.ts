import { TestBed, ComponentFixture } from '@angular/core/testing';
import IntermentAppComponent from './interment-app.component';
import { ServiceIntermnentService } from '../../service/service-intermnent.service';
import { PatientsService } from '../../../patients/service/patients-service.service';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { GetInterments } from '../../interfaces/interments.interface';

describe('IntermentAppComponent', () => {
  let fixture: ComponentFixture<IntermentAppComponent>;
  let component: IntermentAppComponent;

  let serviceIntermentMock: {
    getInterments: jasmine.Spy;
    createInterment: jasmine.Spy;
    filterStatus: any[];
  };

  let patientsServiceMock: {
    getPatientsWithoutCache: jasmine.Spy;
  };

  const queryParamMap$ = new BehaviorSubject(convertToParamMap({}));

  const mockIntermentsResponse: GetInterments = {
    totalPages: 1,
    page: 1,
    total: 1,
    data: [
      {
        id: 1,
        doctorId: 1,
        patientId: 1,
        admissionDate: new Date('2024-01-01T00:00:00Z'),
        dischargeDate: null,
        status: 'PENDING',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-02T00:00:00Z'),
        Diagnosis: [
          {
            id: 1,
            code: 'D01',
            description: 'Dolor abdominal',
            category: 'ADMISSION',
            date: new Date('2024-01-01T00:00:00Z'),
            intermentId: 1,
          },
        ],
        doctor: {
          specialty: 'Clinica',
          licenceNumber: 1234,
          id: 1,
          auth: { id: 1, full_name: 'Dr. House', email: 'house@example.com' },
        },
        patient: {
          name: 'Juan',
          last_name: 'Perez',
          dni: '12345678',
          date_born: new Date('1990-01-01T00:00:00Z'),
          gender: 'MALE',
          phone: '123',
          street: 'Calle 1',
          city: 'CABA',
          state: 'BA',
          zip_code: '1000',
        },
      },
    ],
  };

  const emptyIntermentsResponse: GetInterments = {
    totalPages: 0,
    page: 1,
    total: 0,
    data: [],
  };

  beforeEach(async () => {
    serviceIntermentMock = {
      getInterments: jasmine.createSpy('getInterments').and.returnValue(
        of(mockIntermentsResponse)
      ),
      createInterment: jasmine.createSpy('createInterment'),
      filterStatus: [
        { label: 'Finalizado', status: 'COMPLETED' },
        { label: 'En espera', status: 'PENDING' },
        { label: 'En curso', status: 'IN_PROGRESS' },
      ],
    };

    patientsServiceMock = {
      getPatientsWithoutCache: jasmine
        .createSpy('getPatientsWithoutCache')
        .and.returnValue(of({ data: [] })),
    };

    await TestBed.configureTestingModule({
      imports: [IntermentAppComponent, RouterTestingModule],
      providers: [
        { provide: ServiceIntermnentService, useValue: serviceIntermentMock },
        { provide: PatientsService, useValue: patientsServiceMock },
        { provide: ActivatedRoute, useValue: { queryParamMap: queryParamMap$.asObservable() } },
      ],
    }).compileComponents();
  });

  async function create() {
    fixture = TestBed.createComponent(IntermentAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('should create', async () => {
    await create();
    expect(component).toBeTruthy();
  });

  it('should render at least one interment card with patient full name', async () => {
    await create();
    const articles = fixture.nativeElement.querySelectorAll('article');
    expect(articles.length).toBeGreaterThan(0);
    expect(fixture.nativeElement.textContent).toContain('Juan Perez');
  });

  it('should open modal when clicking "Crear internación" button', async () => {
    await create();
    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button')
    );
    const createBtn = buttons.find((b) => b.textContent?.trim() === 'Crear internación');
    expect(createBtn).toBeTruthy();
    createBtn!.click();
    fixture.detectChanges();
    const modalTitle = fixture.nativeElement.querySelector('h1');
    expect(modalTitle?.textContent).toContain('Crear internación');
  });

  it('should navigate on goToPage()', async () => {
    await create();
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    component.goToPage(2);
    expect(navigateSpy).toHaveBeenCalled();
    const args = navigateSpy.calls.mostRecent().args;
    expect(args[0]).toEqual([]);
    expect(args[1]).toEqual(
      jasmine.objectContaining({
        queryParams: { page: 2, sortedBy: 'createdAt', order: 'desc' },
      })
    );
  });

  it('should show empty state message when there are no interments', async () => {
    serviceIntermentMock.getInterments.and.returnValue(of(emptyIntermentsResponse));
    await create();
    expect(fixture.nativeElement.textContent).toContain(
      'No se encontraron pacientes internados'
    );
  });

  it('should update searchInput when pressing Enter in search field', async () => {
    await create();
    const input: HTMLInputElement | null = fixture.nativeElement.querySelector(
      'input[type="search"]'
    );
    expect(input).toBeTruthy();
    input!.value = 'Juan';
    const event = new KeyboardEvent('keyup', { key: 'Enter' });
    input!.dispatchEvent(event);
    fixture.detectChanges();
    expect(component.searchInput()).toBe('Juan');
  });
});

