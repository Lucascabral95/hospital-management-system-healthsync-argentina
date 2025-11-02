import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { GetAppointmentsDto, Patient } from '../interfaces/get-appointments.interface';
import { CreateAppointmentDto } from '../interfaces/create-appointment.interface';
import { io } from 'socket.io-client';
import { PatientsService } from '../../patients/service/patients-service.service';
import { Specialties } from '../interfaces/specialties.enum';

@Injectable({ providedIn: 'root' })
export default class ServiceAppointments {
  http = inject(HttpClient)
  private patientsService = inject(PatientsService)
  // private socket = io(environment.webSocketUrl);
  private socket = io('wss://hospital-management-system-1-0-0.onrender.com', {
    withCredentials: true,
    transports: ['websocket'],
  });

  appointmentsWebSocket = signal<GetAppointmentsDto[]>([])
  newAppointmentPatient = signal<Patient | null>(null)
  socketError = signal<string | null>(null)

  constructor() {
    this.socket.on('connect_error', () => {
      this.socketError.set('Error de conexión con el servidor. Intentá más tarde.');
    });

    this.socket.on('disconnect', () => {
      this.socketError.set('Se perdió la conexión con el servidor.');
    });

    this.socket.on('connect', () => {
      this.socketError.set(null);
    });

    this.socket.on('getAppointments', (data: GetAppointmentsDto[]) => {
      this.appointmentsWebSocket.set(
        data.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
      )
    });

    this.socket.on('createdAppointments', (newAppointment: GetAppointmentsDto) => {
      this.patientsService.getPatientsById(newAppointment.patientsId).subscribe({
        next: (res) => {
          this.appointmentsWebSocket.update(appointment => {
            const news = [
              ...appointment,
              {
                id: this.appointmentsWebSocket().length + 1,
                patientsId: newAppointment.patientsId,
                specialty: newAppointment.specialty ?? 'Clinician',
                status: 'PENDING',
                scheduledAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
                patient: {
                  id: 1,
                  name: res.name,
                  last_name: res.last_name,
                  dni: res.dni,
                  date_born: new Date(),
                  gender: res.gender,
                  phone: res.phone,
                  email: res.email,
                  country: res.country,
                  createdAt: new Date()
                }
              }
            ];
            return news.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
          });
        },
      })
    });

    this.socket.on('updatedAppointmentStatusInProgress', (id: number) => {
      this.appointmentsWebSocket.update(appointments => {
        const updateds = appointments.map(app =>
          app.id === id ? { ...app, status: 'IN_PROGRESS', updatedAt: new Date() } : app
        );
        return updateds.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      });
    });

    this.socket.on('updatedAppointmentStatusCompleted', (id: number) => {
      this.appointmentsWebSocket.update(appointments => {
        const updateds = appointments.map(app =>
          app.id === id ? { ...app, status: 'COMPLETED', updatedAt: new Date() } : app
        );
        return updateds.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      });
    });

    this.socket.emit('getAppointments');
  }

  createAppointment(createAppointment: CreateAppointmentDto) {
    this.socket.emit('createAppointment', createAppointment);
  }

  updateStatusCompleted(id: number) {
    this.socket.emit('updateStatusCompleted', +id);
  }

  updateStatusInProgress(id: number) {
    this.socket.emit('updateStatusInProgress', +id);
  }

  specialties = signal<Specialties[]>([
    'Clinician',
    'FamilyMedicine',
    'InternalMedicine',
    'Pediatrics',
    'Surgery',
    'Neurology',
    'Psychiatry',
    'Dermatology',
    'EmergencyMedicine',
    'Cardiology',
  ])
}
