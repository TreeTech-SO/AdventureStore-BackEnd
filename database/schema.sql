-- =============================================
-- AdventureStore - Base de Datos
-- Motor: MySQL 8.4 LTS
-- Empresa: TreeTech
-- Encoding: UTF8MB4
-- =============================================

CREATE DATABASE IF NOT EXISTS adventurestore
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE adventurestore;

-- =============================================
-- TABLA: USUARIO
-- =============================================

CREATE TABLE usuario (
  id_usuario           INT NOT NULL AUTO_INCREMENT,
  nombre               VARCHAR(100) NOT NULL,
  apellido             VARCHAR(100) NOT NULL,
  email                VARCHAR(150) NOT NULL,
  contrasena           VARCHAR(255) NOT NULL,
  telefono             VARCHAR(15) NULL,
  fecha_registro       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                        ON UPDATE CURRENT_TIMESTAMP,
  tipo_usuario         ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente',
  estado               ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',

  CONSTRAINT pk_usuario PRIMARY KEY (id_usuario),
  CONSTRAINT uq_usuario_email UNIQUE (email),

  CONSTRAINT chk_usuario_email
    CHECK (email LIKE '%@%.%'),

  CONSTRAINT chk_usuario_telefono
    CHECK (telefono IS NULL OR telefono REGEXP '^[0-9]{9,15}$')
);

CREATE INDEX idx_usuario_email
ON usuario(email);

-- =============================================
-- TABLA: PROVEEDOR
-- =============================================

CREATE TABLE proveedor (
  id_proveedor         INT NOT NULL AUTO_INCREMENT,
  nombre               VARCHAR(150) NOT NULL,
  descripcion          TEXT NULL,
  pais_origen          VARCHAR(100) NULL,
  sitio_web            VARCHAR(255) NULL,
  logo_url             VARCHAR(500) NULL,
  fecha_registro       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT pk_proveedor PRIMARY KEY (id_proveedor),
  CONSTRAINT uq_proveedor_nombre UNIQUE (nombre)
);

-- =============================================
-- TABLA: SEDE
-- =============================================

CREATE TABLE sede (
  id_sede              INT NOT NULL AUTO_INCREMENT,
  nombre_sede          VARCHAR(150) NOT NULL,
  direccion            VARCHAR(255) NOT NULL,
  ciudad               VARCHAR(100) NOT NULL,
  latitud              DECIMAL(10,7) NULL,
  longitud             DECIMAL(10,7) NULL,
  telefono             VARCHAR(15) NULL,
  horario_atencion     VARCHAR(100) NULL,
  estado               ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',

  CONSTRAINT pk_sede PRIMARY KEY (id_sede),

  CONSTRAINT chk_sede_latitud
    CHECK (latitud BETWEEN -90 AND 90),

  CONSTRAINT chk_sede_longitud
    CHECK (longitud BETWEEN -180 AND 180)
);

-- =============================================
-- TABLA: CATEGORIA
-- =============================================

CREATE TABLE categoria (
  id_categoria         INT NOT NULL AUTO_INCREMENT,
  nombre               VARCHAR(100) NOT NULL,
  descripcion          TEXT NULL,
  imagen_url           VARCHAR(500) NULL,

  CONSTRAINT pk_categoria PRIMARY KEY (id_categoria),
  CONSTRAINT uq_categoria_nombre UNIQUE (nombre)
);

-- =============================================
-- TABLA: EQUIPO
-- =============================================

CREATE TABLE equipo (
  id_equipo            INT NOT NULL AUTO_INCREMENT,
  id_proveedor         INT NOT NULL,
  id_categoria         INT NOT NULL,
  nombre               VARCHAR(150) NOT NULL,
  descripcion          TEXT NULL,
  precio_por_dia       DECIMAL(10,2) NOT NULL,
  stock_disponible     INT NOT NULL DEFAULT 1,
  estado               ENUM('disponible', 'no_disponible')
                        NOT NULL DEFAULT 'disponible',
  fecha_registro       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                        ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT pk_equipo PRIMARY KEY (id_equipo),

  CONSTRAINT fk_equipo_proveedor
    FOREIGN KEY (id_proveedor)
    REFERENCES proveedor(id_proveedor)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  CONSTRAINT fk_equipo_categoria
    FOREIGN KEY (id_categoria)
    REFERENCES categoria(id_categoria)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  CONSTRAINT chk_equipo_precio
    CHECK (precio_por_dia > 0),

  CONSTRAINT chk_equipo_stock
    CHECK (stock_disponible >= 0)
);

CREATE INDEX idx_equipo_categoria
ON equipo(id_categoria);

CREATE INDEX idx_equipo_proveedor
ON equipo(id_proveedor);

CREATE INDEX idx_equipo_estado
ON equipo(estado);

-- =============================================
-- TABLA: IMAGEN_EQUIPO
-- =============================================

CREATE TABLE imagen_equipo (
  id_imagen            INT NOT NULL AUTO_INCREMENT,
  id_equipo            INT NOT NULL,
  imagen_url           VARCHAR(500) NOT NULL,
  orden                TINYINT NOT NULL DEFAULT 1,
  descripcion          VARCHAR(255) NULL,

  CONSTRAINT pk_imagen_equipo PRIMARY KEY (id_imagen),

  CONSTRAINT fk_imagen_equipo
    FOREIGN KEY (id_equipo)
    REFERENCES equipo(id_equipo)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT chk_imagen_orden
    CHECK (orden >= 1)
);

CREATE INDEX idx_imagen_equipo
ON imagen_equipo(id_equipo);

-- =============================================
-- TABLA: RESERVA
-- =============================================

CREATE TABLE reserva (
  id_reserva           INT NOT NULL AUTO_INCREMENT,
  id_usuario           INT NOT NULL,
  id_sede              INT NOT NULL,
  fecha_inicio         DATE NOT NULL,
  fecha_fin            DATE NOT NULL,
  fecha_reserva        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                        ON UPDATE CURRENT_TIMESTAMP,

  estado               ENUM(
                          'pendiente',
                          'confirmada',
                          'cancelada',
                          'completada'
                        ) NOT NULL DEFAULT 'pendiente',

  total                DECIMAL(10,2) NOT NULL DEFAULT 0.00,

  CONSTRAINT pk_reserva PRIMARY KEY (id_reserva),

  CONSTRAINT fk_reserva_usuario
    FOREIGN KEY (id_usuario)
    REFERENCES usuario(id_usuario)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  CONSTRAINT fk_reserva_sede
    FOREIGN KEY (id_sede)
    REFERENCES sede(id_sede)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  CONSTRAINT chk_reserva_fechas
    CHECK (fecha_fin > fecha_inicio),

  CONSTRAINT chk_reserva_total
    CHECK (total >= 0)
);

CREATE INDEX idx_reserva_usuario
ON reserva(id_usuario);

CREATE INDEX idx_reserva_estado
ON reserva(estado);

CREATE INDEX idx_reserva_fecha
ON reserva(fecha_reserva);

-- =============================================
-- TABLA: DETALLE_RESERVA
-- =============================================

CREATE TABLE detalle_reserva (
  id_detalle           INT NOT NULL AUTO_INCREMENT,
  id_reserva           INT NOT NULL,
  id_equipo            INT NOT NULL,
  cantidad             INT NOT NULL DEFAULT 1,
  precio_unitario      DECIMAL(10,2) NOT NULL,
  subtotal             DECIMAL(10,2) NOT NULL,

  CONSTRAINT pk_detalle_reserva PRIMARY KEY (id_detalle),

  CONSTRAINT fk_detalle_reserva
    FOREIGN KEY (id_reserva)
    REFERENCES reserva(id_reserva)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_detalle_equipo
    FOREIGN KEY (id_equipo)
    REFERENCES equipo(id_equipo)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  CONSTRAINT chk_detalle_cantidad
    CHECK (cantidad > 0),

  CONSTRAINT chk_detalle_precio
    CHECK (precio_unitario > 0),

  CONSTRAINT chk_detalle_subtotal
    CHECK (subtotal > 0)
);

CREATE INDEX idx_detalle_reserva
ON detalle_reserva(id_reserva);

CREATE INDEX idx_detalle_equipo
ON detalle_reserva(id_equipo);

-- =============================================
-- TABLA: PAGO
-- =============================================

CREATE TABLE pago (
  id_pago                   INT NOT NULL AUTO_INCREMENT,
  id_reserva                INT NOT NULL,

  metodo_pago               ENUM(
                                'tarjeta',
                                'yape',
                                'plin',
                                'efectivo'
                              ) NOT NULL,

  monto                     DECIMAL(10,2) NOT NULL,

  fecha_pago                DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  estado_pago               ENUM(
                                'pendiente',
                                'completado',
                                'fallido',
                                'reembolsado'
                              ) NOT NULL DEFAULT 'pendiente',

  referencia_transaccion    VARCHAR(100) NULL,

  CONSTRAINT pk_pago PRIMARY KEY (id_pago),

  CONSTRAINT uq_pago_reserva UNIQUE (id_reserva),

  CONSTRAINT fk_pago_reserva
    FOREIGN KEY (id_reserva)
    REFERENCES reserva(id_reserva)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  CONSTRAINT chk_pago_monto
    CHECK (monto > 0)
);

-- =============================================
-- TABLA: RESENA
-- =============================================

CREATE TABLE resena (
  id_resena            INT NOT NULL AUTO_INCREMENT,
  id_usuario           INT NOT NULL,
  id_equipo            INT NOT NULL,
  calificacion         TINYINT NOT NULL,
  comentario           TEXT NULL,
  fecha_resena         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT pk_resena PRIMARY KEY (id_resena),

  CONSTRAINT uq_resena_usuario_equipo
    UNIQUE (id_usuario, id_equipo),

  CONSTRAINT fk_resena_usuario
    FOREIGN KEY (id_usuario)
    REFERENCES usuario(id_usuario)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  CONSTRAINT fk_resena_equipo
    FOREIGN KEY (id_equipo)
    REFERENCES equipo(id_equipo)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT chk_resena_calificacion
    CHECK (calificacion BETWEEN 1 AND 5)
);

CREATE INDEX idx_resena_equipo
ON resena(id_equipo);

-- =============================================
-- TABLA: FAVORITO
-- =============================================

CREATE TABLE favorito (
  id_favorito          INT NOT NULL AUTO_INCREMENT,
  id_usuario           INT NOT NULL,
  id_equipo            INT NOT NULL,
  fecha_agregado       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT pk_favorito PRIMARY KEY (id_favorito),

  CONSTRAINT uq_favorito
    UNIQUE (id_usuario, id_equipo),

  CONSTRAINT fk_favorito_usuario
    FOREIGN KEY (id_usuario)
    REFERENCES usuario(id_usuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_favorito_equipo
    FOREIGN KEY (id_equipo)
    REFERENCES equipo(id_equipo)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE INDEX idx_favorito_usuario
ON favorito(id_usuario);

CREATE INDEX idx_favorito_equipo
ON favorito(id_equipo);