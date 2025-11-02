<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/c/cf/Angular_full_color_logo.svg" alt="Angular Logo" width="180"/>
</p>

# Hospital Management System

## Descripción general

Hospital Management System es una aplicación web moderna desarrollada con [Angular](https://angular.dev/) y TypeScript para la gestión integral de hospitales. Permite administrar pacientes, doctores, internaciones, citas médicas, historiales clínicos y más, facilitando la operación diaria y la toma de decisiones en entornos hospitalarios.

---

## ⚙️ Características Principales

- **Gestión de Pacientes:** Registro, edición y búsqueda de pacientes, con información personal, historial y estado de admisión.
- **Administración de Doctores:** Alta, edición y filtrado de personal médico, con especialidades y perfiles.
- **Internaciones:** Registro y seguimiento de internaciones, diagnósticos asociados y estados (pendiente, en progreso, completada).
- **Citas Médicas:** Solicitud, gestión y visualización de turnos médicos, con estados y especialidades.
- **Historiales Médicos:** Visualización y registro de diagnósticos y tratamientos por paciente y doctor.
- **Panel de Administración:** Dashboard con métricas clave y acceso rápido a los módulos principales.
- **Comunicación en Tiempo Real:** Actualización instantánea de citas médicas mediante WebSockets (Socket.io).
- **Autenticación y Autorización:** Acceso seguro con JWT y roles (ADMIN, DOCTOR, PATIENT).
- **Paginación y Filtros:** Listados con paginación y filtros avanzados por nombre, especialidad, estado, etc.
- **UI Moderna:** Interfaz responsiva con TailwindCSS y DaisyUI.
- **Pruebas Unitarias:** Pruebas unitarias con Jasmine y Karma.

---

## 🚀 Tecnologías Utilizadas

- **Angular:** Framework principal para el frontend.
- **TypeScript:** Tipado estático y robustez.
- **RxJS:** Programación reactiva para manejo de datos asíncronos.
- **TailwindCSS & DaisyUI:** Estilos modernos y componentes UI.
- **Socket.io-client:** Comunicación en tiempo real.
- **Jasmine & Karma:** Pruebas unitarias.
- **PostCSS:** Procesamiento de estilos.
- **Docker (opcional):** Para despliegue y pruebas en contenedores.

---

## Tabla de contenidos

- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)
- [Contacto](#contacto)

---

## Instalación

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/Lucascabral95/hospital-management-system-healthsync-argentina.git
   cd hospital-management-system
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Configura el entorno:**

   Crea un archivo `.env` basado en el archivo de ejemplo `.env.example` y configura las variables de entorno según tus necesidades.

4. **Inicia el servidor de desarrollo:**

   ```bash
   ng serve
   ```

5. **Inicia el servidor de pruebas:**

   ```bash
   ng test
   ```

   Accede a la aplicación en `http://localhost:4200/`.

---

## Uso

Una vez que la aplicación esté en funcionamiento, podrás acceder a las diferentes secciones según tu rol (ADMIN, DOCTOR, PATIENT). Cada sección te permitirá gestionar y visualizar la información correspondiente.

---

## Rutas de la aplicación

```plaintext
# Rutas principales del Hospital Management System

/auth
  ├── ''                → Login
  └── register          → Registro

/appointments/patient   → Solicitud de turno por paciente

/appointments           → Gestión de citas médicas en tiempo real

/admin
  ├── ''                → Redirige a /admin/doctors
  ├── doctors           → Gestión de doctores
  ├── doctors/id/:id    → Detalle de doctor (admin)
  ├── patients          → Gestión de pacientes (admin)
  ├── interments        → Gestión de internaciones (admin)
  └── appointments      → Gestión de citas (admin)

/doctors/detail
  └── ''                → Perfil de doctor
  └── :id               → Detalle de doctor por id

/patients
  ├── ''                → Listado de pacientes
  └── detail
      └── ''            → Detalle de paciente
      └── :id           → Detalle de paciente por id

/interments
  ├── ''                → Listado de internaciones
  └── detail
      └── ''            → Detalle de internación
      └── :id           → Detalle de internación por id
```

---

## Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-caracteristica`).
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva característica'`).
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`).
5. Abre un Pull Request.

---

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

## Contacto

Para consultas o más información, puedes contactar a:

- **Lucas Cabral** - [lucascabral95@gmail.com](mailto:lucascabral95@gmail.com)
- **GitHub:** [Lucascabral95](https://github.com/Lucascabral95)
