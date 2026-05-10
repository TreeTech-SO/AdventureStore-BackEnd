-- =============================================
-- DATOS INICIALES - ADVENTURESTORE
-- =============================================

USE adventurestore;

-- =============================================
-- CATEGORIAS
-- =============================================

INSERT INTO categoria (nombre, descripcion, imagen_url)
VALUES
('Camping', 'Equipos para camping y supervivencia', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'),
('Montañismo', 'Equipos especializados para montañas y trekking', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3'),
('Ciclismo', 'Equipos y accesorios para ciclismo extremo', 'https://images.unsplash.com/photo-1517649763962-0c623066013b'),
('Kayak', 'Equipos acuáticos y kayak profesional', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'),
('Escalada', 'Equipos para escalada y aventura vertical', 'https://images.unsplash.com/photo-1522163182402-834f871fd851');

-- =============================================
-- PROVEEDORES
-- =============================================

INSERT INTO proveedor (nombre, descripcion, pais_origen, sitio_web, logo_url)
VALUES
('NorthPeak', 'Marca especializada en equipos outdoor premium', 'Estados Unidos', 'https://northpeak.com', 'https://logo.clearbit.com/northpeak.com'),
('AdventureX', 'Fabricante de equipos extremos y camping', 'Canadá', 'https://adventurex.com', 'https://logo.clearbit.com/adventurex.com'),
('MountainPro', 'Equipamiento profesional para montañismo', 'Suiza', 'https://mountainpro.com', 'https://logo.clearbit.com/mountainpro.com'),
('EcoTrail', 'Equipos ecológicos para actividades outdoor', 'Alemania', 'https://ecotrail.com', 'https://logo.clearbit.com/ecotrail.com');

-- =============================================
-- SEDES
-- =============================================

INSERT INTO sede (
  nombre_sede,
  direccion,
  ciudad,
  latitud,
  longitud,
  telefono,
  horario_atencion
)
VALUES
(
  'AdventureStore Miraflores',
  'Av. Larco 123',
  'Lima',
  -12.1211,
  -77.0297,
  '987654321',
  '09:00 - 21:00'
),
(
  'AdventureStore Cusco',
  'Av. El Sol 456',
  'Cusco',
  -13.5319,
  -71.9675,
  '912345678',
  '08:00 - 20:00'
),
(
  'AdventureStore Arequipa',
  'Calle Mercaderes 789',
  'Arequipa',
  -16.3989,
  -71.5350,
  '923456789',
  '09:00 - 20:00'
);

-- =============================================
-- USUARIOS
-- Contraseña ejemplo:
-- 123456
-- Hash generado con bcrypt
-- =============================================

INSERT INTO usuario (
  nombre,
  apellido,
  email,
  contrasena,
  telefono,
  tipo_usuario
)
VALUES
(
  'Frank',
  'Serrano',
  'frank@adventurestore.com',
  '$2b$10$AXxtmXHt66aerm0jXJE0VuXP3bhjBHEuzzepgy/vhYkfa2jK08kKK',
  '999111222',
  'admin'
),
(
  'Carlos',
  'Ramirez',
  'carlos@gmail.com',
  '$2b$10$sAAeJp9nMQQbE.2pbTMv8eRaXT2XebJ4SvOvMRqAff7M6ywv2R1Oq',
  '988777666',
  'cliente'
),
(
  'Lucia',
  'Torres',
  'lucia@gmail.com',
  '$2b$10$L/LO5k/ERKY6O7te.9U2jOPkS4.VYa.gQtmmMnBGJ6UIiBj1HTSEq',
  '977888999',
  'cliente'
);

-- =============================================
-- EQUIPOS
-- =============================================

INSERT INTO equipo (
  id_proveedor,
  id_categoria,
  nombre,
  descripcion,
  precio_por_dia,
  stock_disponible,
  estado
)
VALUES
(
  1,
  1,
  'Carpa Explorer X2',
  'Carpa impermeable para 2 personas',
  45.00,
  10,
  'disponible'
),
(
  2,
  1,
  'Sleeping Bag Thermal Pro',
  'Bolsa térmica para temperaturas extremas',
  25.00,
  15,
  'disponible'
),
(
  3,
  2,
  'Mochila Trekking 60L',
  'Mochila profesional para largas expediciones',
  35.00,
  8,
  'disponible'
),
(
  3,
  5,
  'Arnés Escalada Pro',
  'Arnés de seguridad profesional',
  30.00,
  12,
  'disponible'
),
(
  4,
  3,
  'Bicicleta Mountain Bike XT',
  'Bicicleta para terrenos extremos',
  120.00,
  5,
  'disponible'
),
(
  1,
  4,
  'Kayak Adventure One',
  'Kayak individual profesional',
  95.00,
  4,
  'disponible'
);

-- =============================================
-- IMAGENES EQUIPO
-- =============================================

INSERT INTO imagen_equipo (
  id_equipo,
  imagen_url,
  orden,
  descripcion
)
VALUES
(
  1,
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4',
  1,
  'Carpa Explorer vista frontal'
),
(
  2,
  'https://images.unsplash.com/photo-1522163182402-834f871fd851',
  1,
  'Sleeping bag térmico'
),
(
  3,
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
  1,
  'Mochila trekking profesional'
),
(
  4,
  'https://images.unsplash.com/photo-1517649763962-0c623066013b',
  1,
  'Arnés profesional'
),
(
  5,
  'https://images.unsplash.com/photo-1541625602330-2277a4c46182',
  1,
  'Mountain bike XT'
),
(
  6,
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
  1,
  'Kayak Adventure'
);

-- =============================================
-- RESERVAS
-- =============================================

INSERT INTO reserva (
  id_usuario,
  id_sede,
  fecha_inicio,
  fecha_fin,
  estado,
  total
)
VALUES
(
  2,
  1,
  '2026-06-10',
  '2026-06-15',
  'confirmada',
  225.00
),
(
  3,
  2,
  '2026-06-20',
  '2026-06-22',
  'pendiente',
  240.00
);

-- =============================================
-- DETALLE RESERVA
-- =============================================

INSERT INTO detalle_reserva (
  id_reserva,
  id_equipo,
  cantidad,
  precio_unitario,
  subtotal
)
VALUES
(
  1,
  1,
  1,
  45.00,
  225.00
),
(
  2,
  5,
  1,
  120.00,
  240.00
);

-- =============================================
-- PAGOS
-- =============================================

INSERT INTO pago (
  id_reserva,
  metodo_pago,
  monto,
  estado_pago,
  referencia_transaccion
)
VALUES
(
  1,
  'yape',
  225.00,
  'completado',
  'YAPE-ADV-1001'
);

-- =============================================
-- RESEÑAS
-- =============================================

INSERT INTO resena (
  id_usuario,
  id_equipo,
  calificacion,
  comentario
)
VALUES
(
  2,
  1,
  5,
  'Excelente calidad y muy resistente'
),
(
  3,
  5,
  4,
  'Muy buena bicicleta para montaña'
);

-- =============================================
-- FAVORITOS
-- =============================================

INSERT INTO favorito (
  id_usuario,
  id_equipo
)
VALUES
(
  2,
  1
),
(
  2,
  3
),
(
  3,
  5
);