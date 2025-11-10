// DTOs para la gestión de usuarios/doctores según la API de Doctoc

// =================== REQUESTS ===================

// Obtener información básica de usuario
export interface GetUserBasicInfoRequestDTO {
  action: 'get';
  orgID: string;
  uid: string;
  type: 'user';
  sections: ['basic', 'professional'] | ['basic'] | ['professional'];
}

// Obtener información de calendario de usuario
export interface GetUserCalendarInfoRequestDTO {
  action: 'get';
  orgID: string;
  uid: string;
  type: 'user';
  sections: ['calendarInfo'];
}

// Obtener información de tipos
export interface GetUserTypesRequestDTO {
  action: 'get';
  orgID: string;
  sections: ['tipos'];
}

// Actualizar información general de calendario
export interface UpdateUserCalendarRequestDTO {
  action: 'update';
  orgID: string;
  uid: string;
  type: 'user';
  data: {
    calendarInfo: {
      overschedule?: boolean;
      configureByType?: boolean;
      horarios?: Record<string, unknown>;
      associatedTypes?: Record<string, number>;
    };
  };
}

// Horarios fijos con tipos
export interface UpdateFixedScheduleWithTypesRequestDTO {
  action: 'update';
  orgID: string;
  uid: string;
  type: 'user';
  data: {
    calendarInfo: {
      configureByType: true;
      horarios: {
        [locationId: string]: {
          [typeId: string]: {
            horariesFijo: WeekSchedule;
          };
        };
      };
    };
  };
}

// Horarios fijos sin tipos
export interface UpdateFixedScheduleWithoutTypesRequestDTO {
  action: 'update';
  orgID: string;
  uid: string;
  type: 'user';
  data: {
    calendarInfo: {
      configureByType: false;
      horarios: {
        [locationId: string]: {
          default: {
            horariesFijo: WeekSchedule;
          };
        };
      };
    };
  };
}

// Horarios dinámicos sin tipos  
export interface UpdateDynamicScheduleWithoutTypesRequestDTO {
  action: 'update';
  orgID: string;
  uid: string;
  type: 'user';
  data: {
    calendarInfo: {
      configureByType: false;
      horarios: {
        [locationId: string]: {
          default: {
            horariesDinamico: DynamicSchedule;
          };
        };
      };
    };
  };
}

// Horarios dinámicos con tipos
export interface UpdateDynamicScheduleWithTypesRequestDTO {
  action: 'update';
  orgID: string;
  uid: string;
  type: 'user';
  data: {
    calendarInfo: {
      configureByType: true;
      horarios: {
        [locationId: string]: {
          [typeId: string]: {
            horariesDinamico: DynamicSchedule;
          };
        };
      };
    };
  };
}

// Tipos asociados
export interface UpdateAssociatedTypesRequestDTO {
  action: 'update';
  orgID: string;
  uid: string;
  type: 'user';
  data: {
    calendarInfo: {
      associatedTypes: {
        [typeId: string]: number; // duración en minutos
      };
    };
  };
}

// =================== RESPONSES ===================

export interface UserBasicInfoResponseDTO {
  status: 'success' | 'error';
  userInfo: {
    userId: string;
    name?: string;
    email?: string;
    speciality?: string;
    photo?: string;
    // Otros campos según la respuesta real de la API
  };
}

export interface UserCalendarInfoResponseDTO {
  status: 'success' | 'error';
  calendar: UserCalendarData;
}

export interface UserTypesResponseDTO {
  status: 'success' | 'error';
  types: Array<{
    typeId: string;
    name: string;
    duration?: number;
    price?: number;
    description?: string;
  }>;
}

// =================== TYPES ===================

// Horarios semanales para horarios fijos
export interface WeekSchedule {
  Monday: TimeSlotFixed[];
  Tuesday: TimeSlotFixed[];
  Wednesday: TimeSlotFixed[];
  Thursday: TimeSlotFixed[];
  Friday: TimeSlotFixed[];
  Saturday: TimeSlotFixed[];
  Sunday: TimeSlotFixed[];
}

// Slots de tiempo para horarios fijos
export interface TimeSlotFixed {
  id: number;
  start: string; // Formato "HH:MM"
  end: string; // Formato "HH:MM"
}

// Horarios dinámicos (estructura flexible)
export interface DynamicSchedule {
  [date: string]: TimeSlotFixed[]; // "YYYY-MM-DD": array de slots
}

export interface UserCalendarData {
  userId: string;
  timezone?: string;
  overbooking?: boolean;
  defaultSchedule?: DaySchedule[];
  exceptions?: CalendarException[];
}

export interface DaySchedule {
  dayOfWeek: number; // 0-6 (Domingo a Sábado)
  isActive: boolean;
  slots: TimeSlot[];
}

export interface TimeSlot {
  startTime: string; // Formato HH:MM
  endTime: string; // Formato HH:MM
  isActive: boolean;
}

export interface CalendarException {
  date: string; // Formato YYYY-MM-DD
  isAvailable: boolean;
  slots?: TimeSlot[];
  reason?: string;
}