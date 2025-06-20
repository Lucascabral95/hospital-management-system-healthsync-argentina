import { Component, computed, effect, inject, signal } from '@angular/core';
import ServiceAppointments from '../../service/appointments-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import TableAppointmentComponent from "../../components/table-appointments/table-appointment/table-appointment.component";
import ErrorRequestComponentComponent from "../../../shared/components/errors/error-request-component/error-request-component.component";
import { CreateAppointmentComponentComponent } from "../../components/create-appointment-component/create-appointment-component/create-appointment-component.component";

@Component({
  selector: 'app-app-appointments',
  imports: [TableAppointmentComponent, ErrorRequestComponentComponent, CreateAppointmentComponentComponent],
  templateUrl: './app-appointments.component.html',
})
export default class AppAppointmentsComponent {
  appointmentService = inject(ServiceAppointments);
  loading = signal<boolean>(false)
  errors = signal<HttpErrorResponse | null>(null)

  isOpenModalCreateAppointment = signal<boolean>(false)

  appointmentsPending = computed(() => {
    return this.appointmentService.appointmentsWebSocket().filter(appo => appo.status === 'PENDING')
  })

  appointmentsInProgress = computed(() => {
    return this.appointmentService.appointmentsWebSocket().filter(appo => appo.status === 'IN_PROGRESS')
  })

  appointmentsCompleted = computed(() => {
    return this.appointmentService.appointmentsWebSocket().filter(appo => appo.status === 'COMPLETED')
  })

  constructor() {
    effect(() => {
      const appointments = this.appointmentService.appointmentsWebSocket();

      if (appointments.length === 0) {
        this.loading.set(true);
        this.errors.set(null);
      } else {
        this.loading.set(false);
        this.errors.set(null);
      }
    });
  }
}
