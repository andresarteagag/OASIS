# 🏝️ OASIS — Reserva de escenarios deportivos

Plataforma web para reservar los escenarios deportivos de la Universidad de Medellín. Nació como proyecto académico para reemplazar el proceso presencial (hay que ir a reservar con un día de anticipación) por un sistema en línea, rápido y transparente.

> Proyecto desarrollado para el cliente *Bienestar Universitario – Universidad de Medellín*. 

## ¿Qué hace?

**Usuario (estudiante, profesor, personal)**
- Se registra con su correo `@soyudemedellin.edu.co` e inicia sesión.
- Puede tener **una sola reserva activa** a la vez.
- Si no puede asistir, **la reprograma** (escenario, fecha u hora) o **la cancela**.
- Consulta su historial de reservas finalizadas.

**Administrador**
- CRUD de **reservas** de cualquier usuario (crear, reprogramar, eliminar, buscar).
- CRUD de **usuarios** (crear, editar, eliminar).
- CRUD de **escenarios** y control de disponibilidad.

Los permisos se validan **en el servidor** (token de sesión + rol), no solo en la interfaz.

## Arquitectura

```
┌────────────┐   HTTP/JSON   ┌──────────────────┐   logs TCP   ┌──────────┐   ┌───────────────┐   ┌────────┐
│  Angular   │ ────────────► │  Spring Boot API │ ───────────► │ Logstash │ ► │ Elasticsearch │ ► │ Kibana │
│ (Nginx :80)│               │      :8080       │              │  :5000   │   │     :9200     │   │  :5601 │
└────────────┘               └──────────────────┘              └──────────┘   └───────────────┘   └────────┘
```

| Capa | Tecnología |
|---|---|
| Frontend | Angular 16, TypeScript, SweetAlert2 |
| Backend | Java 17, Spring Boot 3.4, Springdoc (Swagger UI) |
| Observabilidad | Logback + Logstash encoder, ELK 8.12 |
| Despliegue | Docker, Docker Compose, imágenes en DockerHub |

## Estructura del repositorio

```
OASIS/
├── backend/            # API REST (Spring Boot)
│   └── src/main/java/com/udem/reservas/backend/
│       ├── controller/ # Endpoints REST
│       ├── service/    # Lógica de negocio
│       ├── model/      # Entidades
│       └── dto/        # Objetos de entrada
├── frontend/
│   └── reservas-app/   # SPA Angular
├── logstash/pipeline/  # Pipeline de logs
├── docs/               # Documentación del proyecto (Hito 2)
└── docker-compose.yml
```

## Ejecución

### Con Docker Compose (todo el stack)

```bash
git clone https://github.com/andresarteagag/OASIS.git
cd OASIS
docker compose up --build
```

| Servicio | URL |
|---|---|
| Frontend | http://localhost:4200 |
| API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| Kibana | http://localhost:5601 |

### Local (sin Docker)

Requisitos: Java 17+, Node 18+.

```bash
# Backend
cd backend
./mvnw spring-boot:run

# Frontend (otra terminal)
cd frontend/reservas-app
npm install
npm start          # http://localhost:4200
```

> Fuera de Docker el backend intenta conectarse a Logstash (`logstash:5000`) y mostrará avisos de conexión en consola; no afecta el funcionamiento.

## Credenciales de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@udem.edu.co` | `admin123` |

Los usuarios normales se crean desde la pantalla de registro. Solo para desarrollo.

## API

Salvo login y registro, todas las rutas requieren `Authorization: Bearer <token>`.

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/usuarios/login`, `/api/usuarios/registrar` | Público |
| POST | `/api/usuarios/logout` | Sesión |
| GET · POST | `/api/usuarios` | Admin |
| PUT · DELETE | `/api/usuarios/{correo}` | Admin |
| GET | `/api/escenarios` | Sesión |
| POST · PUT · DELETE | `/api/escenarios/...` | Admin |
| POST | `/api/reservas/crear` | Sesión (una activa por usuario) |
| GET | `/api/reservas/usuario/{correo}` | Dueño o admin |
| PUT · DELETE | `/api/reservas/{id}` | Dueño o admin |
| GET | `/api/reservas`, `/api/reservas/escenario/{nombre}`, `/api/reservas/reporte/por-escenario` | Admin |

Errores de negocio: `{ "message": "..." }` con 400, 401, 403, 404 o 409.

## Frontend: decisiones de diseño

- Sistema visual con tokens CSS en `src/styles.css` (paleta del logo UdeM, tipografía Bricolage Grotesque + Instrument Sans).
- `AuthService` (estado de sesión) separado de `UsuarioService` (HTTP) para que el `AuthInterceptor` no genere dependencia circular.
- `environment.ts` / `environment.prod.ts` para la URL de la API.
- Modelos tipados, helpers compartidos en `core/utils.ts`, guards por rol.

## Limitaciones conocidas / próximos pasos

- Los datos viven **en memoria**: se pierden al reiniciar el backend. Siguiente paso: JPA + la base MySQL que ya define el compose.
- Las contraseñas se guardan en texto plano; falta hashing (BCrypt) y expiración de tokens (o JWT con Spring Security).
- Sin pruebas automatizadas todavía.

