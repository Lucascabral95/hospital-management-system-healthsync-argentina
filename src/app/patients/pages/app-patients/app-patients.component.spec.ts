import { ComponentFixture, TestBed } from '@angular/core/testing';
import AppPatientsComponent from './app-patients.component';
import { PatientsService } from '../../service/patients-service.service';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

class MockPatientsService {
  patients = [
    { key: 'name', label: 'Nombre' },
    { key: 'date_born', label: 'Fecha de nacimiento' }
  ];
  getPatients = jasmine.createSpy('getPatients').and.returnValue(of({
    data: [
      { id: 1, name: 'John Doe', date_born: '1990-01-01' },
      { id: 2, name: 'Jane Smith', date_born: '1985-05-15' }
    ],
    totalPages: 5
  }));
}

describe('AppPatientsComponent', () => {
  let component: AppPatientsComponent;
  let fixture: ComponentFixture<AppPatientsComponent>;
  let patientsService: MockPatientsService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,  // provee Router para RouterLink/RouterOutlet en hijos
        AppPatientsComponent  // standalone: va en imports
      ],
      providers: [
        { provide: PatientsService, useClass: MockPatientsService },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap({
              page: '1',
              orderBy: 'name', // tu toSignal usa orderBy por defecto
              order: 'desc'
            }))
          }
        },
        provideNoopAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppPatientsComponent);
    component = fixture.componentInstance;
    patientsService = TestBed.inject(PatientsService) as unknown as MockPatientsService;
    router = TestBed.inject(Router);
    fixture.detectChanges(); // dispara rxResource y señales
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize signals from query parameters', () => {
    expect(component.page()).toBe(1);
    expect(component.sortedBy()).toBe('name');  // viene de orderBy -> 'name'
    expect(component.order()).toBe('desc');
  });

  it('should call getPatients on init with page/sortedBy/order', () => {
    expect(patientsService.getPatients).toHaveBeenCalledWith(1, 'name', 'desc');
  });

  it('should set patients and quantityPages on successful response', () => {
    expect(component.patients()).toEqual(jasmine.objectContaining({
      data: jasmine.any(Array),
      totalPages: 5
    }));
    expect(component.quantityPages()).toBe(5);
  });

  it('should update filtered list on search query', () => {
    component.searchQuery.set('John');
    fixture.detectChanges();
    const filtered = component.filtered();
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('John Doe');
  });

  it('should sort by name ascending when filter is set accordingly', () => {
    component.filter.set('Nombre: ascendente');
    fixture.detectChanges();
    const names = component.filtered().map(p => p.name);
    expect(names).toEqual(['Jane Smith', 'John Doe']);
  });

  it('should sort by date ascending when filter is set accordingly', () => {
    component.filter.set('Fecha de nacimiento: ascendente');
    fixture.detectChanges();
    const dates = component.filtered().map(p => p.date_born);
    expect(dates).toEqual(['1985-05-15', '1990-01-01']);
  });

  it('should handle error from getPatients and set errorsPatients', () => {
    const err = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
    (patientsService.getPatients as jasmine.Spy).and.returnValue(throwError(() => err));

    // Re-crear para que rxResource/OnInit re-ejecute con el error
    fixture = TestBed.createComponent(AppPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.errorsPatients()).toEqual({ status: 404, message: 'No se encontraron pacientes' });
  });

  it('should navigate to selected page preserving sort params', () => {
    const navSpy = spyOn(router, 'navigate').and.resolveTo(true);
    component.goToPage(2);
    expect(navSpy).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        // El componente realmente usa { page, sortedBy, order }
        queryParams: { page: 2, sortedBy: 'name', order: 'desc' }
      })
    );
  });

  it('should set page to 1 on filter change (and trigger navigation)', () => {
    const navSpy = spyOn(router, 'navigate').and.resolveTo(true);
    component.filter.set('Nombre: descendente');
    component.onFilter('Nombre: descendente'); // también llama goToPage(1)
    expect(navSpy).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: { page: 1, sortedBy: 'name', order: 'desc' }
      })
    );
  });

  it('should open modal when toggled', () => {
    component.isOpenModal.set(true);
    fixture.detectChanges();
    expect(component.isOpenModal()).toBeTrue();
  });
});
