# 🏥 App Doctoc - Sistema de Gestión Médica

**App Doctoc** es una plataforma web moderna para la gestión integral de clínicas médicas, desarrollada con **Next.js 15** y **Clean Architecture**. Permite a las organizaciones médicas gestionar doctores, pacientes, citas y más a través de una interfaz intuitiva y profesional.

## 🚀 Características Principales

### 🌐 **Landing Page Profesional**
- **Página principal informativa** con información de la clínica
- **Navegación intuitiva** con acceso a login/registro
- **Sección de especialidades médicas** con filtros dinámicos
- **Ubicaciones de sedes** con integración a mapas
- **Diseño responsive** optimizado para móviles

### 👩‍⚕️ **Gestión de Doctores**
- **Búsqueda avanzada** por especialidad y ubicación
- **Perfiles detallados** con información profesional
- **Página pública de doctores** para visitantes
- **API completa** para gestión de calendarios y horarios

### 📅 **Sistema de Citas**
- **Agendamiento inteligente** con validación de disponibilidad
- **Gestión de overbooking** configurable
- **Notificaciones automáticas** (próximamente)
- **Historial completo** de citas por paciente

### 👥 **Gestión de Pacientes**
- **Registro completo** con validación de datos
- **Búsqueda por DNI, teléfono o nombre**
- **Historiales médicos** seguros y accesibles
- **Dashboard personalizado** para cada paciente

## 🛠️ Stack Tecnológico

### **Frontend**
- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático para mayor robustez
- **Tailwind CSS** - Diseño moderno y responsive
- **Lucide React** - Iconografía profesional

### **Backend & APIs**
- **Doctoc API** - API REST para gestión médica completa
- **Firebase Auth** - Autenticación segura y escalable
- **Server Actions** - Gestión de formularios y mutaciones

### **Arquitectura**
- **Clean Architecture** - Separación clara de responsabilidades
- **Repository Pattern** - Abstracción de fuentes de datos
- **Custom Hooks** - Gestión de estado reutilizable
- **Component-Based Design** - Componentes modulares y reutilizables

## 📁 Estructura del Proyecto

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Rutas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── doctors/
│   │   ├── browse/               # Página pública de doctores
│   │   └── search/               # Búsqueda protegida
│   ├── appointments/             # Gestión de citas
│   ├── patients/                 # Gestión de pacientes
│   └── dashboard/                # Dashboard principal
├── core/
│   ├── domain/                   # Capa de Dominio
│   │   ├── entities/             # Doctor, Patient, Appointment, etc.
│   │   ├── repositories/         # Interfaces de repositorios
│   │   └── use-cases/            # Lógica de negocio
│   └── application/              # Capa de Aplicación
│       ├── services/             # Servicios de aplicación
│       └── dto/                  # Data Transfer Objects
├── infrastructure/               # Capa de Infraestructura
│   ├── api/                      # Cliente API Doctoc
│   ├── auth/                     # Implementación Firebase
│   └── repositories/             # Implementación de repositorios
├── presentation/                 # Capa de Presentación
│   ├── components/
│   │   ├── ui/                   # Componentes base (Button, Input, etc.)
│   │   ├── features/             # Componentes por funcionalidad
│   │   └── layouts/              # Navigation, Footer, etc.
│   ├── hooks/                    # Custom React Hooks
│   └── utils/                    # Utilidades de UI
└── config/                       # Configuración y constantes
```

## 🔌 API de Doctoc

### **Endpoints Principales**

#### **🏢 Información de Organización**
```typescript
// Obtener información básica
GET /getOrgInfoAPIV2 { sections: ['basic'] }

// Obtener especialidades
GET /getOrgInfoAPIV2 { sections: ['specialties'] }

// Obtener ubicaciones/sedes
GET /getOrgInfoAPIV2 { sections: ['sedes'] }

// Obtener usuarios/doctores
GET /getOrgInfoAPIV2 { sections: ['users'] }
```

#### **👩‍⚕️ Gestión de Doctores**
```typescript
// Información del doctor
POST /manageUserInfoAPIV2 { action: 'get_basic_info' }

// Información del calendario
POST /manageUserInfoAPIV2 { action: 'get_calendar_info' }

// Tipos de cita disponibles
POST /manageUserInfoAPIV2 { action: 'get_user_types' }
```

#### **📅 Gestión de Citas**
```typescript
// Crear nueva cita
POST /manageQuotesAPIV2 { action: 'create' }

// Obtener citas del paciente
POST /getPatientQuoteAPIV2

// Obtener citas del día
POST /getDayQuotesAPIV2

// Slots ocupados del doctor
POST /getDayQuotesAPIV2 { format: 'busy_ranges' }
```

#### **👥 Gestión de Pacientes**
```typescript
// Crear paciente
POST /managePatientsAPIV2 { action: 'create' }

// Buscar pacientes
POST /managePatientsAPIV2 { action: 'search' }

// Búsqueda por DNI/teléfono
POST /managePatientsAPIV2 { action: 'search_by_dni' }
```

## 🔐 Autenticación con Firebase

### **Configuración**
```typescript
// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... otras configuraciones
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### **Context de Autenticación**
- **Estado global** del usuario autenticado
- **Protección automática** de rutas privadas
- **Redirecciones inteligentes** según estado de auth
- **Persistencia de sesión** entre recargas

## 🚦 Rutas y Navegación

### **🌍 Rutas Públicas**
- `/` - Landing page informativa
- `/doctors/browse` - Catálogo público de doctores
- `/login` - Inicio de sesión
- `/register` - Registro de nuevos usuarios

### **🔒 Rutas Protegidas**
- `/dashboard` - Panel principal del usuario
- `/appointments` - Gestión de citas médicas
- `/doctors/search` - Búsqueda avanzada de doctores
- `/patients` - Gestión de pacientes (solo doctores)

## ⚙️ Instalación y Desarrollo

### **Prerrequisitos**
- Node.js 18+ 
- npm o yarn
- Cuenta de Firebase
- Acceso a la API de Doctoc

### **Configuración**

1. **Clona el repositorio:**
```bash
git clone https://github.com/AnthonyGit1/app-doctoc.git
cd app-doctoc
```

2. **Instala dependencias:**
```bash
npm install
```

3. **Configura variables de entorno:**
```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id

NEXT_PUBLIC_DOCTOC_API_URL=https://us-central1-doctoc-main.cloudfunctions.net
NEXT_PUBLIC_DOCTOC_API_TOKEN=tu_api_token
NEXT_PUBLIC_DEFAULT_ORG_ID=tu_org_id
```

4. **Ejecuta en desarrollo:**
```bash
npm run dev
```

5. **Compila para producción:**
```bash
npm run build
npm start
```

## 🎯 Funcionalidades Implementadas

### ✅ **Completadas**
- [x] Landing page profesional con información de clínica
- [x] Sistema de navegación con autenticación
- [x] Búsqueda pública de doctores con API real
- [x] Integración completa con Firebase Auth
- [x] Arquitectura limpia con separación de responsabilidades
- [x] Componentes reutilizables y responsive
- [x] Gestión de estado con custom hooks

### 🚧 **En Desarrollo**
- [ ] Sistema completo de agendamiento de citas
- [ ] Dashboard de doctor con gestión de horarios
- [ ] Notificaciones push y por email
- [ ] Reportes y analytics
- [ ] Gestión de pagos integrada

## 📱 Responsive Design

El sistema está optimizado para todos los dispositivos:
- **📱 Mobile First** - Diseño prioritario para móviles
- **📋 Tablet Friendly** - Adaptación perfecta para tabletas
- **💻 Desktop Optimized** - Experiencia completa en escritorio

## 🤝 Contribución

1. Fork el proyecto
2. Crea una branch para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. Push a la branch (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Desarrollado por

**Anthony** - [GitHub](https://github.com/AnthonyGit1)

---

*🏥 App Doctoc - Modernizando la gestión médica, una clínica a la vez.*
