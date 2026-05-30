# TaskFlow Backend

API REST para gestión de proyectos y tareas, construida con NestJS, TypeScript, Prisma y PostgreSQL.

## Stack Tecnológico

- **Framework:** NestJS
- **Lenguaje:** TypeScript
- **ORM:** Prisma (v7)
- **Base de datos:** PostgreSQL
- **Validación:** class-validator, class-transformer

---

## Clase 1 - Fundamentos y Configuración

### Estructura del Proyecto

```
src/
├── main.ts                    # Bootstrap de la aplicación con ValidationPipe
├── app.module.ts              # Módulo principal
├── prisma/
│   ├── prisma.module.ts       # Módulo de Prisma
│   └── prisma.service.ts      # Servicio con adapter para PostgreSQL
└── users/
    ├── users.module.ts        # CRUD de Usuarios
    ├── users.controller.ts    # Endpoints REST
    ├── users.service.ts       # Lógica de negocio
    └── dto/
        ├── create-user.dto.ts
        └── update-user.dto.ts
```

### Modelos de Datos (Prisma Schema)

```prisma
model User {
  id            String          @id @default(uuid())
  email         String          @unique
  password      String
  name          String
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  ownedProjects Project[]
  memberships   ProjectMember[]
  assignedTasks Task[]
  comments      Comment[]
}

model Project {
  id          String          @id @default(uuid())
  name        String
  description String?
  ownerId     String
  owner       User            @relation("ProjectOwner", fields: [ownerId], references: [id], onDelete: Cascade)
  members     ProjectMember[]
  tasks       Task[]
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
}

model Task {
  id          String     @id @default(uuid())
  title       String
  description String?
  status      TaskStatus @default(PENDING)
  priority    Priority   @default(MEDIUM)
  dueDate     DateTime?
  projectId   String
  project     Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)
  assigneeId  String?
  assignee    User?      @relation("TaskAssignee", fields: [assigneeId], references: [id])
  comments    Comment[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum TaskStatus { PENDING IN_PROGRESS DONE }
enum Priority { LOW MEDIUM HIGH }
```

### Configuración de Prisma 7

El `PrismaService` utiliza el adapter `@prisma/adapter-pg` para PostgreSQL:

```typescript
constructor() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  super({ adapter });
}
```

### Endpoints - Users

| Método | Ruta          | Descripción              |
|--------|---------------|--------------------------|
| POST   | /users        | Crear usuario            |
| GET    | /users        | Listar todos los usuarios|
| GET    | /users/:id    | Obtener un usuario       |
| PATCH  | /users/:id    | Actualizar usuario       |
| DELETE | /users/:id    | Eliminar usuario         |

---

## Clase 2 - CRUD de Projects

### Estructura

```
src/projects/
├── projects.module.ts
├── projects.controller.ts
├── projects.service.ts
└── dto/
    ├── create-project.dto.ts
    └── update-project.dto.ts
```

### Reglas de Negocio

- `create`: recibe `ownerId` del body (temporal, luego vendrá del JWT)
- `findAll`: incluye `owner` con solo `id` y `name` (usando `include` + `select`)
- `findOne`: incluye `owner`, `tasks` y `members`

### Endpoints - Projects

| Método | Ruta             | Descripción                  |
|--------|------------------|------------------------------|
| POST   | /projects        | Crear proyecto               |
| GET    | /projects        | Listar todos los proyectos    |
| GET    | /projects/:id    | Obtener proyecto con detalles |
| PATCH  | /projects/:id    | Actualizar proyecto          |
| DELETE | /projects/:id    | Eliminar proyecto            |

---

## Ejecución del Proyecto

```bash
# Instalar dependencias
npm install

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones (primera vez)
npx prisma migrate dev

# Levantar en modo desarrollo
npm run start:dev

# El servidor estará disponible en http://localhost:3000
```

## Variables de Entorno (.env)

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskflow_db?schema=public"
PORT=3000
NODE_ENV=development
```

## Validación de Datos

Se utiliza `ValidationPipe` global con las siguientes opciones:

- `whitelist: true` - Elimina campos no definidos en el DTO
- `forbidNonWhitelisted: true` - Rechaza objetos con campos extra

---

## Próximos Pasos (Clase 3)

- Autenticación con JWT
- Proteger endpoints con Guards
- Obtener `ownerId` del token JWT en lugar del body