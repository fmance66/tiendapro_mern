# TiendaPro plataforma eCommerce

> Plataforma de comercio electrónico construida con el stack MERN y Redux.

Para ver el proyecto ir a https://tiendapro-6azb.onrender.com

## Características

- Carrito de compras completo
- Reseñas y calificaciones de productos
- Carrusel de productos destacados
- Paginación de productos
- Búsqueda de productos
- Perfil de usuario con historial de pedidos
- Gestión de productos (Administrador)
- Gestión de usuarios (Administrador)
- Página de detalle de pedidos (Administrador)
- Opción para marcar pedidos como entregados
- Proceso de checkout (envío, método de pago, etc.)
- Integración con PayPal / tarjeta de crédito
- Loader de base de datos (seeder) de productos y usuarios

##  Usage

### Env Variables

Creá un archivo .env en la raíz del proyecto y agregá lo siguiente:

```
NODE_ENV=development
PORT=5000
MONGO_URI=tu uri de mongodb
JWT_SECRET=abc123
PAYPAL_CLIENT_ID=tu client id de paypal
```

### Instalar Dependencias (frontend y backend)

```
npm install
cd frontend
npm install
```

### Ejecutar la aplicación

```
# Ejecutar frontend (:3000) y backend (:5000)
npm run dev

# Ejecutar solo el backend
npm run server
```

## Build & Deploy

```
# Crear build de producción del frontend
cd frontend
npm run build
```

### Cargar la Base de Datos (Seed)

Podés usar los siguientes comandos para cargar la base de datos con usuarios y productos de ejemplo, o eliminar todos los datos:

```
# Importar datos
npm run data:import

# Reemplazar datos
npm run data:replace
```

# Eliminar datos
npm run data:destroy
```

```
Usuarios de ejemplo

admin@example.com (Admin)
123456

fmancevich@mainit.com.ar (Admin)
mega08ne

john@example.com (Customer)
123456

jane@example.com (Customer)
123456

leimancevich@gmail.com
123456

rosmartinez@gmail.com
123456
```

## Licencia

Licencia MIT

Copyright (c) 2026 Main IT https://mainit.com
