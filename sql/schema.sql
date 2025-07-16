-- Script para crear y poblar la base de datos para la aplicación de seguimiento de Totes.

-- --- Creación de Tablas ---

-- Tabla para almacenar la información de los usuarios del sistema.
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- En una aplicación real, esta contraseña debería estar hasheada.
    role ENUM('Admin', 'User') NOT NULL DEFAULT 'User'
);

-- Tabla para almacenar la información de los clientes.
CREATE TABLE clients (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255)
);

-- Tabla para almacenar la información de los totes.
CREATE TABLE totes (
    id VARCHAR(255) PRIMARY KEY,
    status ENUM('Con Cliente', 'Disponible', 'En Lavado', 'En Mantenimiento', 'En Uso', 'Baja') NOT NULL,
    clientId VARCHAR(255),
    lastDispatch DATETIME,
    FOREIGN KEY (clientId) REFERENCES clients(id)
);


-- --- Inserción de Datos de Ejemplo ---

-- Insertar un usuario administrador de prueba.
INSERT INTO users (id, name, email, password, role) VALUES
('1', 'Admin Ditzler', 'test@example.com', 'password123', 'Admin');

-- Insertar clientes de ejemplo.
INSERT INTO clients (id, name, contact) VALUES
('1', 'Del Valle', 'contacto@delvalle.com'),
('2', 'Sol Radiante', 'contacto@solradiante.com'),
('3', 'Los Andes', 'contacto@losandes.com'),
('4', 'Del Pacifico', 'contacto@delpacifico.com'),
('5', 'Del Maipo', 'contacto@delmaipo.com');

-- Insertar totes de ejemplo.
INSERT INTO totes (id, status, clientId, lastDispatch) VALUES
('TOTE-001', 'Con Cliente', '1', '2024-05-10 12:00:00'),
('TOTE-002', 'Con Cliente', '1', '2024-05-10 12:00:00'),
('TOTE-003', 'Con Cliente', '2', '2024-04-15 12:00:00'),
('TOTE-004', 'Con Cliente', '2', '2024-04-15 12:00:00'),
('TOTE-005', 'Con Cliente', '3', '2024-06-01 12:00:00'),
('TOTE-006', 'Con Cliente', '3', '2024-06-01 12:00:00'),
('TOTE-007', 'Con Cliente', '4', '2024-06-20 12:00:00'),
('TOTE-008', 'Con Cliente', '4', '2024-06-20 12:00:00'),
('TOTE-009', 'Con Cliente', '5', '2024-04-25 12:00:00'),
('TOTE-010', 'Disponible', NULL, NULL),
('TOTE-011', 'Disponible', NULL, NULL),
('TOTE-012', 'Disponible', NULL, NULL),
('TOTE-013', 'Disponible', NULL, NULL),
('TOTE-014', 'Disponible', NULL, NULL),
('TOTE-015', 'En Lavado', NULL, NULL),
('TOTE-016', 'En Lavado', NULL, NULL),
('TOTE-017', 'En Lavado', NULL, NULL),
('TOTE-018', 'En Mantenimiento', NULL, NULL),
('TOTE-019', 'En Mantenimiento', NULL, NULL),
('TOTE-020', 'En Uso', NULL, NULL),
('TOTE-021', 'En Uso', NULL, NULL),
('TOTE-022', 'En Uso', NULL, NULL);

