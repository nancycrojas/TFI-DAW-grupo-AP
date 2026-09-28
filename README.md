## Sistema de Gestión de Clínica

Trabajo Final Integrador de la materia Desarrollo de Aplicaciones Web.

### Tecnologías

- NestJS
- TypeORM
- PostgreSQL
- Angular
- Swagger
- Compodoc
- JWT
- bcrypt
- Helmet

### Estructura actual

El proyecto se encuentra dividido en:

- `backend/`: API desarrollada con NestJS.
- `frontend/`: se incorporará posteriormente.

Actualmente el backend cuenta con:

- Configuración mediante variables de entorno.
- Swagger para documentación de la API.
- Compodoc para documentación técnica.
- Configuración inicial de autenticación.
- Login mediante documento y clave.
- Enums para estados y roles de usuarios.
- Base de datos PostgreSQL `clinica`.

### Base de datos

La base incluye actualmente las tablas:

- `usuarios`
- `medicos`
- `reservas`

Y los tipos ENUM:

- `estados_usuarios`
- `roles_usuarios`
- `estados_reservas`

### Configuración

Crear un archivo `.env` dentro de `backend/` tomando como referencia:

```text
backend/.env.example
```

### Luego instalar las dependencias:

```text
cd backend
npm install
```

### Ejecución
```text
npm start
```

### Swagger estará disponible en:
```text
http://localhost:3000/api
```

### Documentación

Para iniciar Compodoc:
```text
npm run compodoc
```

Disponible en:
```text
http://127.0.0.1:8081
```
