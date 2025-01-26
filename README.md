# API Bancaria

API REST para sistema bancario que permite gestionar tarjetas, cuentas y transacciones de manera segura.

## Funcionalidades Detalladas

### 1. Gestión de Tarjetas
- **Activación Inicial**
  - Activación obligatoria para primer uso
  - Cambio de PIN obligatorio tras activación
  - Validación de seguridad

- **Configuración de Tarjetas**
  - Consulta de límites
  - Modificación de límites (rango: 500€ - 6.000€)
  - Cambio de PIN en cualquier momento

### 2. Consulta de Movimientos
- **Tipos de Movimientos**
  - Ingresos en efectivo
  - Retiradas de efectivo
  - Comisiones aplicadas
  - Transferencias entrantes
  - Transferencias salientes
- **Filtros**
  - Por cuenta
  - Ordenados por fecha

### 3. Operaciones en Cajero
- **Retiros de Efectivo**
  - Validación de saldo (tarjetas débito)
  - Control de límite de crédito
  - Límites de retiro configurables
  - Cálculo de comisiones interbancarias

- **Depósitos**
  - Solo en cajeros del mismo banco
  - Validación de cuenta asociada
  - Actualización inmediata de saldo

- **Transferencias**
  - Validación de IBAN
  - Transferencias interbancarias
  - Cálculo de comisiones
  - Límites según tipo de tarjeta

### 4. Seguridad
- Autenticación mediante tarjeta y PIN
- PIN encriptado en base de datos
- Tokens JWT para sesiones
- Validación de tarjetas activas

## Requisitos Previos

- Node.js >= 14
- MongoDB >= 4.4
- Docker (opcional)

## Configuración Local

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/banco-api.git
cd banco-api
```


2. Instalar dependencias:

```bash
npm install
```


3. Configurar variables de entorno:

Crear archivo `.env` basado en `.env.example` 
```bash
cp .env.example .env
# Editar variables en .env:
# - MONGODB_URI
# - JWT_SECRET
```

4. Iniciar en desarrollo:
```bash
npm run dev
```


## Estructura del proyecto

```bash
banco-api/
├── src/
│   ├── config/              # Configuraciones (database, env, etc.)
│   │   └── database.ts
│   │
│   ├── controllers/         # Lógica de negocio
│   │   ├── auth.controller.ts
│   │   ├── card.controller.ts
│   │   └── transaction.controller.ts
│   │
│   ├── middleware/          # Middlewares personalizados
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   │
│   ├── models/             # Modelos de MongoDB
│   │   ├── User.ts
│   │   ├── Card.ts
│   │   ├── Account.ts
│   │   └── Transaction.ts
│   │
│   ├── routes/             # Rutas de la API
│   │   ├── index.ts        # Archivo principal de rutas
│   │   ├── auth.routes.ts
│   │   ├── card.routes.ts
│   │   └── transaction.routes.ts
│   │
│   ├── types/              # Interfaces y tipos
│   │   └── index.ts
│   │
│   ├── utils/              # Utilidades y helpers
│   │   ├── validators.ts
│   │   └── encryption.ts
│   │
│   └── index.ts            # Punto de entrada de la aplicación
│
├── tests/                  # Tests
│   ├── integration/
│   └── unit/
│
├── .env                    # Variables de entorno
├── .gitignore
├── package.json
├── tsconfig.json
├── Dockerfile
└── docker-compose.yml
```


### Despliegue con Docker

1. Construir contenedores:
```bash
docker-compose build
```

2. Iniciar servicios:
```bash
docker-compose up -d
```


## Testing

```bash
# Ejecutar todos los tests
npm test

# Tests unitarios
npm run test:unit

# Tests de integración
npm run test:integration
```

## CI/CD

El proyecto utiliza GitHub Actions para:
- Ejecución automática de tests
- Análisis de código
- Construcción de imagen Docker
- Despliegue automático


## Documentación API

### Autenticación

```http
POST /api/auth/validate-card
Content-Type: application/json

{
  "cardNumber": "4532000000001234",
  "pin": "1234"
}
```

### Operaciones con Tarjetas

```http
POST /api/cards/activate
PUT /api/cards/change-pin
GET /api/cards/limits
PUT /api/cards/limits
```

### Transacciones

```http
GET /api/transactions
POST /api/transactions/withdraw
POST /api/transactions/deposit
POST /api/transactions/transfer
```




