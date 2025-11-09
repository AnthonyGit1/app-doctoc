import { API_CONFIG } from '../../config/constants';

// Cliente de API para interactuar con las APIs de Doctoc
export class DoctocApiClient {
  private baseUrl: string;
  private authToken: string;
  
  constructor(baseUrl?: string, authToken?: string) {
    this.baseUrl = baseUrl || API_CONFIG.BASE_URL;
    this.authToken = authToken || API_CONFIG.AUTH_TOKEN;
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authToken}`,
    };
  }

  async post<TRequest = unknown, TResponse = unknown>(
    endpoint: string, 
    data: TRequest
  ): Promise<TResponse> {
    const url = `${this.baseUrl}/${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json() as TResponse;
      return result;
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error);
      throw new Error(`API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async get<TResponse = unknown>(
    endpoint: string,
    queryParams?: Record<string, string>
  ): Promise<TResponse> {
    let url = `${this.baseUrl}/${endpoint}`;
    
    if (queryParams) {
      const params = new URLSearchParams(queryParams);
      url += `?${params.toString()}`;
    }
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json() as TResponse;
      return result;
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error);
      throw new Error(`API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}