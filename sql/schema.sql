-- Users Table
CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) CHECK (role IN ('Admin', 'User')) NOT NULL
);

-- Clients Table
CREATE TABLE clients (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    contact NVARCHAR(255)
);

-- Totes Table
CREATE TABLE totes (
    id NVARCHAR(255) PRIMARY KEY,
    status NVARCHAR(50) CHECK (status IN ('Con Cliente', 'Disponible', 'En Lavado', 'En Mantenimiento', 'En Uso', 'Baja')) NOT NULL,
    client_id INT,
    last_dispatch DATETIME,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);
