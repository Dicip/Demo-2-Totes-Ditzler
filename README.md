# Aplicación de Seguimiento de Totes - Ditzler

Esta es una aplicación NextJS para el seguimiento de totes de Ditzler.

## Configuración

### Base de Datos

1. Crea una base de datos SQL Server.
2. Ejecuta el script de esquema ubicado en `sql/schema.sql` para crear las tablas y datos iniciales.
3. Copia el archivo `.env.example` a `.env` y configura las variables de entorno:

```
DATABASE_URL=mssql://usuario:contraseña@host:puerto/nombre_base_datos
```

Reemplaza `usuario`, `contraseña`, `host`, `puerto` y `nombre_base_datos` con tus propios valores.

### Instalación

```bash
npm install
npm run dev
```

## Desarrollo

Para comenzar, revisa los archivos principales:

- `src/app/page.tsx`: Página principal
- `src/lib/db.ts`: Configuración de la base de datos
- `sql/schema.sql`: Esquema de la base de datos
