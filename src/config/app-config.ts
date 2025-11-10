import { DoctocApiClient } from '../infrastructure/api/api-client';
import { DoctocApi } from '../infrastructure/api/doctoc-api';
import { API_CONFIG } from './constants';

// Configuración e inicialización de servicios
class AppConfig {
  private static instance: AppConfig;
  public readonly apiClient: DoctocApiClient;
  public readonly doctocApi: DoctocApi;

  private constructor() {
    // Validar configuración requerida
    this.validateConfiguration();
    
    // Inicializar cliente de API
    this.apiClient = new DoctocApiClient(
      API_CONFIG.BASE_URL,
      API_CONFIG.AUTH_TOKEN
    );

    // Inicializar API específica de Doctoc
    this.doctocApi = new DoctocApi(this.apiClient);
  }

  public static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  private validateConfiguration(): void {
    const requiredEnvVars = [
      { name: 'NEXT_PUBLIC_DOCTOC_API_URL', value: API_CONFIG.BASE_URL },
      { name: 'DOCTOC_API_TOKEN', value: API_CONFIG.AUTH_TOKEN },
      { name: 'NEXT_PUBLIC_DEFAULT_ORG_ID', value: API_CONFIG.DEFAULT_ORG_ID },
    ];

    const missingVars = requiredEnvVars.filter(({ value }) => !value);

    if (missingVars.length > 0) {
      console.error('❌ Faltan variables de entorno requeridas:');
      missingVars.forEach(({ name }) => {
        console.error(`   - ${name}`);
      });
      console.error('\n💡 Asegúrate de crear un archivo .env.local basado en .env.example');
      
      // En desarrollo, mostrar advertencia pero continuar
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️  Continuando en modo desarrollo con configuración incompleta');
      } else {
        throw new Error('Configuración incompleta. Revisa las variables de entorno.');
      }
    }
  }

  // Método para verificar si la configuración es válida
  public isConfigured(): boolean {
    return !!(API_CONFIG.BASE_URL && API_CONFIG.AUTH_TOKEN && API_CONFIG.DEFAULT_ORG_ID);
  }

  // Método para obtener información de configuración (sin datos sensibles)
  public getConfigInfo() {
    return {
      baseUrl: API_CONFIG.BASE_URL,
      hasAuthToken: !!API_CONFIG.AUTH_TOKEN,
      defaultOrgId: API_CONFIG.DEFAULT_ORG_ID,
      timeout: API_CONFIG.TIMEOUT,
    };
  }
}

// Exportar instancia singleton
export const appConfig = AppConfig.getInstance();

// Exportar tipos para dependency injection si es necesario
export type { DoctocApiClient, DoctocApi };

// Función helper para obtener la configuración
export const getAppConfig = () => appConfig;