import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment.development';
import { DataPatient, Gender, GetPatients } from '../../patients/interfaces/patients-get.interface';
import { PatientsByIDDto } from '../../patients/interfaces/patients-by-id.interface';
import { PatientsService } from '../../patients/service/patients-service.service';

const buildDataPatient = (overrides: Partial<DataPatient> = {}): DataPatient => ({
  id: 1,
  dni: '12345678',
  name: 'John',
  last_name: 'Doe',
  date_born: '1990-01-01',
  gender: Gender.Male,
  phone: '1234567890',
  email: 'john@example.com',
  is_admitted: false,
  street: '123 Main St',
  city: 'Metropolis',
  state: 'State',
  zip_code: '12345',
  country: 'Country',
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  updatedAt: new Date('2023-01-02T00:00:00.000Z'),
  ...overrides
});

const buildPatientById = (overrides: Partial<PatientsByIDDto> = {}): PatientsByIDDto => ({
  id: 1,
  dni: '12345678',
  name: 'John',
  last_name: 'Doe',
  date_born: new Date('1990-01-01T00:00:00.000Z'),
  gender: 'MALE',
  phone: '1234567890',
  email: 'john@example.com',
  is_admitted: false,
  street: '123 Main St',
  city: 'Metropolis',
  state: 'State',
  zip_code: '12345',
  country: 'Country',
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  updatedAt: new Date('2023-01-02T00:00:00.000Z'),
  ...overrides
});

describe('PatientsService', () => {
  let service: PatientsService;
  let httpMock: HttpTestingController;
  const URL = environment.url_project;
  const LIMIT = environment.limit;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(PatientsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getPatients debe hacer GET con query params por defecto y cachear la respuesta', () => {
    const resp: GetPatients = {
      data: [],
      totalPages: 3,
      page: 1,
      total: 0
    };
    let result: GetPatients | undefined;

    service.getPatients().subscribe(r => (result = r));

    const req = httpMock.expectOne(r => r.method === 'GET' && r.url === `${URL}/patients`);
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('sortedBy')).toBe('name');
    expect(req.request.params.get('limit')).toBe(String(LIMIT));
    expect(req.request.params.get('order')).toBe('desc');

    req.flush(resp);
    expect(result).toEqual(resp);

    // Segunda llamada debe salir del caché (no nueva request)
    service.getPatients().subscribe(r => expect(r).toEqual(resp));
    httpMock.expectNone(r => r.url === `${URL}/patients` && r.method === 'GET');
  });

  it('getPatients debe respetar page/sortedBy/order custom y cacheKey distinto', () => {
    const resp: GetPatients = {
      data: [buildDataPatient({ id: 2 })],
      totalPages: 5,
      page: 2,
      total: 10
    };
    service.getPatients(2, 'createdAt', 'asc').subscribe(r => expect(r).toEqual(resp));

    const req = httpMock.expectOne(r =>
      r.method === 'GET' &&
      r.url === `${URL}/patients` &&
      r.params.get('page') === '2' &&
      r.params.get('sortedBy') === 'createdAt' &&
      r.params.get('order') === 'asc' &&
      r.params.get('limit') === String(LIMIT)
    );
    req.flush(resp);

    // caché para la misma combinación
    service.getPatients(2, 'createdAt', 'asc').subscribe(r => expect(r).toEqual(resp));
    httpMock.expectNone(r => r.url === `${URL}/patients` && r.method === 'GET');
  });

  it('onClearPatientsCache debe invalidar el cache de getPatients', () => {
    const resp: GetPatients = {
      data: [],
      totalPages: 1,
      page: 1,
      total: 0
    };
    service.getPatients().subscribe();
    const req1 = httpMock.expectOne(r => r.method === 'GET' && r.url === `${URL}/patients`);
    req1.flush(resp);

    service.onClearPatientsCache();

    service.getPatients().subscribe();
    const req2 = httpMock.expectOne(r => r.method === 'GET' && r.url === `${URL}/patients`);
    req2.flush(resp);
  });

  it('getPatientsWithoutCache debe hacer GET con limit=100000 sin cache', () => {
    const resp: GetPatients = {
      data: [buildDataPatient({ id: 3 })],
      totalPages: 1,
      page: 1,
      total: 1
    };
    service.getPatientsWithoutCache().subscribe(r => expect(r).toEqual(resp));
    const req = httpMock.expectOne(r => r.method === 'GET' && r.url === `${URL}/patients`);
    expect(req.request.params.get('limit')).toBe('100000');
    req.flush(resp);

    // segunda llamada vuelve a pedir (sin cache)
    service.getPatientsWithoutCache().subscribe();
    const req2 = httpMock.expectOne(r => r.method === 'GET' && r.url === `${URL}/patients`);
    expect(req2.request.params.get('limit')).toBe('100000');
    req2.flush(resp);
  });

  it('getPatientsById debe cachear por id y servir desde cache en segunda llamada', () => {
    const resp = buildPatientById({ id: 7, name: 'Alice' });
    service.getPatientsById(7).subscribe(r => expect(r).toEqual(resp));
    const req = httpMock.expectOne(r => r.method === 'GET' && r.url === `${URL}/patients/7`);
    req.flush(resp);

    service.getPatientsById(7).subscribe(r => expect(r).toEqual(resp));
    httpMock.expectNone(r => r.method === 'GET' && r.url === `${URL}/patients/7`);
  });

  it('onClearPatientByIdCache debe invalidar cache por id', () => {
    const resp = buildPatientById({ id: 3, name: 'Bob' });
    service.getPatientsById(3).subscribe();
    httpMock.expectOne(r => r.method === 'GET' && r.url === `${URL}/patients/3`).flush(resp);

    service.onClearPatientByIdCache(3);

    service.getPatientsById(3).subscribe();
    httpMock.expectOne(r => r.method === 'GET' && r.url === `${URL}/patients/3`).flush(resp);
  });

  it('updatePatientById debe enviar PATCH con payload', () => {
    const payload = { name: 'Neo' } as any;
    const resp = { ...payload };
    service.updatePatientById(9, payload).subscribe(r => expect(r).toEqual(resp));
    const req = httpMock.expectOne(r => r.method === 'PATCH' && r.url === `${URL}/patients/9`);
    expect(req.request.body).toEqual(payload);
    req.flush(resp);
  });

  it('createPatient debe invalidar el cache de pacientes al crear', () => {
    service.getPatients().subscribe();
    httpMock.expectOne(r => r.method === 'GET' && r.url === `${URL}/patients`).flush({
      data: [],
      totalPages: 1,
      page: 1,
      total: 0
    });

    const newPatient = { name: 'New' } as any;
    const created = { id: 10 } as any;

    service.createPatient(newPatient).subscribe(r => expect(r).toEqual(created));
    const postReq = httpMock.expectOne(r => r.method === 'POST' && r.url === `${URL}/patients`);
    expect(postReq.request.body).toEqual(newPatient);
    postReq.flush(created);

    // tras invalidar cache, siguiente getPatients debe disparar nuevo GET
    service.getPatients().subscribe();
    const refreshedReq = httpMock.expectOne(r => r.method === 'GET' && r.url === `${URL}/patients`);
    refreshedReq.flush({
      data: [buildDataPatient({ id: created.id })],
      totalPages: 1,
      page: 1,
      total: 1
    });
  });

  it('getMedicalRecordsPatientsById debe setear medicalRecordOfPatientCache signal', () => {
    const recs = [{ id: 1 }, { id: 2 }] as any;
    service.getMedicalRecordsPatientsById(5, 'asc').subscribe(r => expect(r).toEqual(recs));
    const req = httpMock.expectOne(r =>
      r.method === 'GET' &&
      r.url === `${URL}/medical-records/5/patient` &&
      r.params.get('order') === 'asc'
    );
    req.flush(recs);

    expect(service.medicalRecordOfPatientCache()).toEqual(recs);
  });

  it('createDiagnosis debe POST y refrescar medical records llamando getMedicalRecordsPatientsById', () => {
    const dto = { patientsId: 12, description: 'Dx' } as any;
    const created = { id: 99 } as any;
    const refreshed = [{ id: 7 }] as any;

    service.createDiagnosis(dto).subscribe(r => expect(r).toEqual(created));
    const postReq = httpMock.expectOne(r => r.method === 'POST' && r.url === `${URL}/medical-records`);
    expect(postReq.request.body).toEqual(dto);
    postReq.flush(created);

    const getReq = httpMock.expectOne(r => r.method === 'GET' && r.url === `${URL}/medical-records/12/patient`);
    // si tu servicio setea un order por defecto (p.ej. 'desc'), puedes asertarlo:
    // expect(getReq.request.params.get('order')).toBe('desc');
    getReq.flush(refreshed);
    expect(service.medicalRecordOfPatientCache()).toEqual(refreshed);
  });

  it('getPatientsWithSelect debe setear selectPatientsOptions signal', () => {
    const options = [{ id: 1, name: 'A' }] as any;
    service.getPatientsWithSelect().subscribe(r => expect(r).toEqual(options));
    const req = httpMock.expectOne(r => r.method === 'GET' && r.url === `${URL}/patients/select`);
    req.flush(options);
    expect(service.selectPatientsOptions()).toEqual(options);
  });

  it('addDiagnosisPatient debe POST y devolver la respuesta', () => {
    const dto = { patientsId: 5, description: 'dx' } as any;
    const resp = { id: 321 } as any;
    service.addDiagnosisPatient(dto).subscribe(r => expect(r).toEqual(resp));
    const req = httpMock.expectOne(r => r.method === 'POST' && r.url === `${URL}/medical-records`);
    expect(req.request.body).toEqual(dto);
    req.flush(resp);
  });

  it('searchPatientsByNameOrLastName debe GET con param patient', () => {
    const resp = [{ id: 1, name: 'John' }] as any;
    service.searchPatientsByNameOrLastName('john').subscribe(r => expect(r).toEqual(resp));
    const req = httpMock.expectOne(r =>
      r.method === 'GET' &&
      r.url === `${URL}/patients/search` &&
      r.params.get('patient') === 'john'
    );
    req.flush(resp);
  });

  it('getDataPatientForAppointment debe GET por DNI', () => {
    const resp = { id: 1 } as any;
    service.getDataPatientForAppointment('123').subscribe(r => expect(r).toEqual(resp));
    const req = httpMock.expectOne(r => r.method === 'GET' && r.url === `${URL}/patients/dni/123`);
    req.flush(resp);
  });
});
