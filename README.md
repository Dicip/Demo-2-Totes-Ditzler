# Aplicación de Seguimiento de Totes - Ditzler

Esta es una aplicación web desarrollada con Next.js para el seguimiento y gestión de totes (contenedores) de Ditzler. La aplicación permite administrar el inventario de totes, asignarlos a clientes y realizar un seguimiento de su estado y ubicación.

## Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 18, Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes (Server Components)
- **Base de Datos**: SQL Server
- **Autenticación**: Sistema propio de autenticación

## Configuración

### Base de Datos

1. Crea una base de datos SQL Server.
2. Ejecuta el script de esquema ubicado en `sql/schema.sql` para crear las tablas y datos iniciales.
3. La configuración de la conexión a la base de datos se encuentra en `src/lib/db.ts`:

```typescript
// Configuración directa de la conexión a SQL Server
const config = {
    user: 'sa',
    password: '123',
    server: 'localhost',
    port: 1433,
    database: 'Prueba',
    options: {
        encrypt: true, // Para conexiones Azure
        trustServerCertificate: true // Cambiar a false para producción
    }
};
```

Modifica estos valores según tu configuración de SQL Server.

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en puerto 3000
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Estructura del Proyecto

- `src/app/`: Componentes y páginas de la aplicación (Next.js App Router)
- `src/components/`: Componentes reutilizables
- `src/lib/`: Utilidades y configuraciones
  - `db.ts`: Configuración de la conexión a SQL Server
  - `schemas.ts`: Esquemas de validación
  - `utils.ts`: Funciones de utilidad
- `sql/`: Scripts SQL
  - `schema.sql`: Esquema de la base de datos con tablas y datos iniciales

## Modelo de Datos

### Usuarios (Users)
- Administradores y usuarios del sistema
- Roles: Admin, User

### Clientes (Clients)
- Empresas que utilizan los totes
- Información de contacto

### Totes
- Contenedores que se asignan a clientes
- Estados: Con Cliente, Disponible, En Lavado, En Mantenimiento, En Uso, Baja

## Desarrollo

Para comenzar a desarrollar, revisa los archivos principales:

- `src/app/page.tsx`: Página principal
- `src/lib/db.ts`: Configuración de la base de datos
- `sql/schema.sql`: Esquema de la base de datos

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo en el puerto 3000
- `npm run build`: Compila la aplicación para producción
- `npm run start`: Inicia la aplicación compilada
- `npm run lint`: Ejecuta el linter para verificar el código
- `npm run typecheck`: Verifica los tipos de TypeScript
