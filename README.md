# Backend AdventureStore - Documentación para Frontend

## 1. Información General

- **URL Base**: `http://localhost:5000/api`
- **Puerto**: `5000`
- **Base de Datos**: MySQL (adventurestore)
- **Autenticación**: JWT (Token Bearer)
- **CORS**: ✅ Habilitado para el puerto `5173` (Vite por defecto)

---

## 🚀 Guía Rápida de Integración Frontend (FAQ)

**1. ¿Cuál es la estructura exacta de las rutas del backend?**
Todas las rutas base tienen el prefijo `/api`. Las principales son:
- Autenticación: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- Catálogo: `/api/equipos`, `/api/equipos/:id`, `/api/categorias`
- Reservas: `/api/reservas`, `/api/reservas/:id`
- Favoritos: `/api/favoritos`, `/api/favoritos/:id_equipo`

**2. ¿Cómo viene estructurado el JSON y cómo se llaman los campos de BD?**
Para Autenticación y Errores Globales, el formato estandarizado es:
```json
{
  "ok": true, // o false si hay error
  "message": "Mensaje opcional",
  "data": { ... }, // Dependiendo del endpoint (ej. datos del usuario)
  "error": "Detalle del error si ok es false"
}
```
**Campos exactos de BD (Ejemplo Equipos):**
- Precio de alquiler: `precio_por_dia`
- Nombre: `nombre`
- Stock: `stock_disponible`
- Categoría: `id_categoria`
*(Revisar la sección "3. Estructura de Datos" más abajo para el detalle exacto de todas las tablas).*

**3. ¿Qué campos exactos espera el backend para Register y Reservas?**
- **Registro (`POST /api/auth/register`)**: 
  Espera JSON con: `nombre`, `apellido`, `email`, `contrasena`, y `telefono` (opcional).
- **Crear Reserva (`POST /api/reservas`)**: 
  Espera JSON con: `id_sede`, `fecha_inicio` (YYYY-MM-DD), `fecha_fin` (YYYY-MM-DD), `detalles` (Array con `id_equipo`, `cantidad`, `precio_unitario`). *(Requiere enviar token JWT en header).* 

**4. ¿El backend está corriendo y CORS configurado?**
Sí, al ejecutar `npm run dev` el backend estará en el puerto `5000` (`http://localhost:5000`). **CORS ya está configurado** para permitir peticiones desde el puerto `5173` (Vite) hacia el puerto `5000`.

**5. ¿Cómo empezamos a enlazar el catálogo?**
La estructura del backend está lista. Te sugiero crear los siguientes archivos en tu frontend dentro de `src/services/`:
- `api.js` (Instancia de Axios con interceptores)
- `authService.js` (login, register, getMe)
- `equipoService.js` (obtener equipos y detalles)
¡Sí, podemos empezar por crear `equipoService.js` y conectar el catálogo inmediatamente!

---

## 2. Rutas del Backend

### 2.1 Autenticación (`/api/auth`)

#### Obtener Usuario Autenticado (Auth Me)

- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200):**
  ```json
  {
    "ok": true,
    "user": {
      "id_usuario": 1,
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan@example.com",
      "tipo_usuario": "cliente",
      "estado": "activo"
    }
  }
  ```

#### Registro

- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "contrasena": "password123",
    "telefono": "987654321"
  }
  ```
- **Response (201):**
  ```json
  {
    "ok": true,
    "message": "Usuario registrado exitosamente",
    "data": {
      "user": {
        "id_usuario": 1,
        "nombre": "Juan",
        "apellido": "Pérez",
        "email": "juan@example.com",
        "tipo_usuario": "cliente"
      }
    }
  }
  ```

#### Login

- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "juan@example.com",
    "contrasena": "password123"
  }
  ```
- **Response (200):**
  ```json
  {
    "ok": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id_usuario": 1,
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan@example.com",
      "tipo_usuario": "cliente"
    }
  }
  ```

---

### 2.2 Equipos (`/api/equipos`)

#### Obtener todos los equipos

- **GET** `/api/equipos`
- **Parámetros query (opcional):**
  - `id_categoria`: filtrar por categoría
  - `estado`: `disponible` o `no_disponible`
- **Response (200):**
  ```json
  {
    "ok": true,
    "data": {
      "equipos": [
        {
          "id_equipo": 1,
          "nombre": "Tienda de campaña 4 personas",
          "descripcion": "Tienda de camping resistente al agua",
          "precio_por_dia": 50.00,
          "stock_disponible": 10,
          "estado": "disponible",
          "id_categoria": 1,
          "id_proveedor": 1,
          "fecha_registro": "2026-01-15T10:30:00.000Z"
        }
      ]
    }
  }
  ```

#### Obtener equipo por ID

- **GET** `/api/equipos/:id`
- **Response (200):**
  ```json
  {
    "ok": true,
    "data": {
      "equipo": {
        "id_equipo": 1,
        "nombre": "Tienda de campaña 4 personas",
        "descripcion": "Tienda de camping resistente al agua",
        "precio_por_dia": 50.0,
        "stock_disponible": 10,
        "estado": "disponible",
        "id_categoria": 1,
        "id_proveedor": 1,
        "fecha_registro": "2026-01-15T10:30:00.000Z"
      }
    }
  }
  ```

#### Crear equipo (Solo Admins)

- **POST** `/api/equipos`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body:**
  ```json
  {
    "id_proveedor": 1,
    "id_categoria": 1,
    "nombre": "Mochila de senderismo 60L",
    "descripcion": "Mochila ergonómica para largos viajes",
    "precio_por_dia": 25.0,
    "stock_disponible": 5,
    "estado": "disponible"
  }
  ```

---

### 2.3 Categorías (`/api/categorias`)

#### Obtener todas las categorías

- **GET** `/api/categorias`
- **Response (200):**
  ```json
  {
    "ok": true,
    "data": {
      "categorias": [
        {
          "id_categoria": 1,
          "nombre": "Camping",
          "descripcion": "Equipos para acampar",
          "imagen_url": "https://example.com/camping.jpg"
        },
        {
          "id_categoria": 2,
          "nombre": "Senderismo",
          "descripcion": "Equipos para trekking",
          "imagen_url": "https://example.com/senderismo.jpg"
        }
      ]
    }
  }
  ```

---

### 2.4 Reservas (`/api/reservas`)

**⚠️ TODAS LAS RUTAS REQUIEREN AUTENTICACIÓN (TOKEN JWT)**

#### Crear reserva

- **POST** `/api/reservas`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body:**
  ```json
  {
    "id_sede": 1,
    "fecha_inicio": "2026-05-15",
    "fecha_fin": "2026-05-18",
    "detalles": [
      {
        "id_equipo": 1,
        "cantidad": 1,
        "precio_unitario": 50.0
      },
      {
        "id_equipo": 3,
        "cantidad": 2,
        "precio_unitario": 25.0
      }
    ]
  }
  ```
- **Response (201):**
  ```json
  {
    "ok": true,
    "message": "Reserva creada exitosamente",
    "data": {
      "reserva": {
        "id_reserva": 5,
        "id_usuario": 1,
        "id_sede": 1,
        "fecha_inicio": "2026-05-15",
        "fecha_fin": "2026-05-18",
        "total": 200.0,
        "detalles": [...]
      }
    }
  }
  ```

#### Obtener mis reservas

- **GET** `/api/reservas`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200):**
  ```json
  {
    "ok": true,
    "data": {
      "reservas": [
        {
          "id_reserva": 5,
          "id_usuario": 1,
          "id_sede": 1,
          "fecha_inicio": "2026-05-15",
          "fecha_fin": "2026-05-18",
          "estado": "confirmada",
          "total": 200.00,
          "nombre_sede": "Sede Lima Norte"
        }
      ]
    }
  }
  ```

#### Obtener reserva por ID

- **GET** `/api/reservas/:id`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200):**
  ```json
  {
    "ok": true,
    "data": {
      "reserva": {
        "id_reserva": 5,
        "id_usuario": 1,
        "id_sede": 1,
        "fecha_inicio": "2026-05-15",
        "fecha_fin": "2026-05-18",
        "estado": "confirmada",
        "total": 200.0,
        "detalles": [
          {
            "id_detalle": 10,
            "id_equipo": 1,
            "cantidad": 1,
            "precio_unitario": 50.0,
            "subtotal": 50.0,
            "equipo_nombre": "Tienda de campaña 4 personas"
          }
        ]
      }
    }
  }
  ```

---

### 2.5 Favoritos (`/api/favoritos`)

**⚠️ REQUIERE AUTENTICACIÓN**

#### Obtener mis favoritos

- **GET** `/api/favoritos`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200):**
  ```json
  {
    "ok": true,
    "data": {
      "favoritos": [
        {
          "id_favorito": 1,
          "id_equipo": 1,
          "nombre": "Tienda de campaña 4 personas",
          "precio_por_dia": 50.0,
          "fecha_agregado": "2026-05-10T15:30:00.000Z"
        }
      ]
    }
  }
  ```

#### Agregar a favoritos

- **POST** `/api/favoritos`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body:**
  ```json
  {
    "id_equipo": 1
  }
  ```
- **Response (201):**
  ```json
  {
    "ok": true,
    "message": "Equipo agregado a favoritos",
    "data": { "favorito": { "id_favorito": 5, "id_usuario": 1, "id_equipo": 1 } }
  }
  ```

#### Eliminar de favoritos

- **DELETE** `/api/favoritos/:id_equipo`  ← usar `id_equipo`, no el `id_favorito`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200):**
  ```json
  {
    "ok": true,
    "message": "Equipo eliminado de favoritos"
  }
  ```

---

### 2.6 Reseñas (`/api/resenas`)

**⚠️ REQUIERE AUTENTICACIÓN PARA CREAR**

#### Obtener reseñas

- **GET** `/api/resenas?id_equipo=1` ← compatible con frontend
- **GET** `/api/resenas/equipo/:equipoId` ← ruta alternativa
- **Response (200):**
  ```json
  {
    "ok": true,
    "data": {
      "resenas": [
        {
          "id_resena": 1,
          "id_equipo": 1,
          "id_usuario": 3,
          "calificacion": 5,
          "comentario": "Excelente equipo",
          "fecha_resena": "2026-05-10T15:30:00.000Z"
        }
      ]
    }
  }
  ```

#### Crear reseña

- **POST** `/api/resenas`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body:**
  ```json
  {
    "id_equipo": 1,
    "calificacion": 5,
    "comentario": "Excelente equipo, muy recomendado"
  }
  ```
- **Response (201):**
  ```json
  {
    "ok": true,
    "message": "Reseña creada exitosamente",
    "data": { "resena": { ... } }
  }
  ```

---

## 3. Estructura de Datos (Base de Datos)

### Tabla: USUARIO

| Campo          | Tipo         | Descripción           |
| -------------- | ------------ | --------------------- |
| `id_usuario`   | INT          | ID único              |
| `nombre`       | VARCHAR(100) | Nombre del usuario    |
| `apellido`     | VARCHAR(100) | Apellido del usuario  |
| `email`        | VARCHAR(150) | Email único           |
| `contrasena`   | VARCHAR(255) | Contraseña hasheada   |
| `telefono`     | VARCHAR(15)  | Teléfono (opcional)   |
| `tipo_usuario` | ENUM         | 'cliente' o 'admin'   |
| `estado`       | ENUM         | 'activo' o 'inactivo' |

### Tabla: EQUIPO

| Campo              | Tipo          | Descripción                    |
| ------------------ | ------------- | ------------------------------ |
| `id_equipo`        | INT           | ID único                       |
| `id_proveedor`     | INT           | FK a proveedor                 |
| `id_categoria`     | INT           | FK a categoría                 |
| `nombre`           | VARCHAR(150)  | Nombre del equipo              |
| `descripcion`      | TEXT          | Descripción detallada          |
| `precio_por_dia`   | DECIMAL(10,2) | Precio de alquiler diario      |
| `stock_disponible` | INT           | Cantidad disponible            |
| `estado`           | ENUM          | 'disponible' o 'no_disponible' |

### Tabla: RESERVA

| Campo          | Tipo          | Descripción                                          |
| -------------- | ------------- | ---------------------------------------------------- |
| `id_reserva`   | INT           | ID único                                             |
| `id_usuario`   | INT           | FK a usuario                                         |
| `id_sede`      | INT           | FK a sede                                            |
| `fecha_inicio` | DATE          | Fecha de inicio                                      |
| `fecha_fin`    | DATE          | Fecha de fin                                         |
| `estado`       | ENUM          | 'pendiente', 'confirmada', 'cancelada', 'completada' |
| `total`        | DECIMAL(10,2) | Monto total                                          |

### Tabla: DETALLE_RESERVA

| Campo             | Tipo          | Descripción                  |
| ----------------- | ------------- | ---------------------------- |
| `id_detalle`      | INT           | ID único                     |
| `id_reserva`      | INT           | FK a reserva                 |
| `id_equipo`       | INT           | FK a equipo                  |
| `cantidad`        | INT           | Cantidad de equipos          |
| `precio_unitario` | DECIMAL(10,2) | Precio por unidad            |
| `subtotal`        | DECIMAL(10,2) | Subtotal (cantidad × precio) |

---

## 4. Códigos de Error

| Código | Descripción                            |
| ------ | -------------------------------------- |
| `200`  | OK - Solicitud exitosa                 |
| `201`  | Created - Recurso creado               |
| `400`  | Bad Request - Datos inválidos          |
| `401`  | Unauthorized - Falta token JWT         |
| `403`  | Forbidden - Sin permisos (no es admin) |
| `404`  | Not Found - Recurso no encontrado      |
| `500`  | Server Error - Error interno           |

---

## 5. Implementación en el Frontend

### Headers requeridos para peticiones autenticadas:

```javascript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}
```

### Ejemplo con Axios (con interceptor JWT):

```javascript
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Interceptor para agregar token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
```

### Uso en componentes:

```javascript
import API from "./api/axiosConfig";

// Obtener equipos
const getEquipos = async () => {
  const { data } = await API.get("/equipos");
  return data.data.equipos;
};

// Crear reserva
const createReserva = async (reservaData) => {
  const { data } = await API.post("/reservas", reservaData);
  return data.data.reserva;
};
```

---

## 6. CORS Configuración

El backend está configurado para aceptar peticiones desde `FRONTEND_URL` (definido en `.env`).

**En producción, cambiar en `.env`:**

```env
FRONTEND_URL=https://tu-dominio.com
```

---

## 7. Próximos Pasos

1. ✅ Crear servicios en el frontend (`src/services/equipoService.js`, `reservaService.js`, etc.)
2. ✅ Conectar componentes con las rutas del backend
3. ✅ Implementar manejo de errores y loading states
4. ✅ Agregar validaciones en formularios

---

## 8. Iniciar el Servidor

```bash
npm install      # Si aún no lo hiciste
npm start        # Producción
npm run dev      # Desarrollo (con nodemon)
```

El servidor estará disponible en: **http://localhost:5000**

---

## 9. 🔧 Bug Fix Changelog

### v1.1.0 — Auditoría de Estabilización

| # | Severidad | Archivo | Descripción |
|---|-----------|---------|-------------|
| 1 | 🔴 Crítico | `middleware/authMiddleware.js` | `req.user.id` era `undefined` porque la BD retorna `id_usuario`. Ahora el middleware normaliza con `id: rows[0].id_usuario`. |
| 2 | 🔴 Crítico | `services/reservaService.js` | INSERT de reserva tenía 5 columnas pero solo 4 parámetros (faltaba `id_sede`). |
| 3 | 🔴 Crítico | `routes/resenaRoutes.js` + controller | Frontend usa `?id_equipo=1` pero backend solo aceptaba `/equipo/:id`. Ahora se soportan ambas rutas. |
| 4 | 🟡 Moderado | `services/favoritoService.js` + controller | DELETE usaba `id_favorito` que el frontend nunca tiene. Cambiado a `id_equipo + id_usuario`. |
| 5 | 🟡 Moderado | `middleware/authMiddleware.js` | Falta de validación de `decoded.id`: token con payload incorrecto causaba fallo silencioso. |
| 6 | 🟢 Mejora | `server.js` | Añadido `PATCH` a la lista de métodos CORS permitidos. |
| 7 | 🟢 Mejora | Todos los controllers | Respuestas estandarizadas a `{ ok, data, message, error }` en toda la API. |
| 8 | 🟢 Mejora | `README.md` | Documentación actualizada con ejemplos JSON reales y rutas corregidas. |
