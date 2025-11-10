// =================== GESTIÓN DE PRECIOS DTOs ===================

// ========== Obtener Todos los Precios ==========
export interface GetAllPricesRequestDTO {
  orgID: string;
  action: 'prices';
}

export interface PriceItem {
  precio: string;
  concepto: string;
  id: number;
  categoria: string;
  person: string;
  type: string;
  last_update: string;
  register_date: string;
  categoryName: string;
  categoryColor: string;
}

export interface GetAllPricesResponseDTO {
  total: number;
  prices: PriceItem[];
}

// ========== Obtener Categorías ==========
export interface GetPriceCategoriesRequestDTO {
  orgID: string;
  action: 'categories';
}

export interface PriceCategory {
  description: string;
  color: string;
  name: string;
  id: number;
}

export interface GetPriceCategoriesResponseDTO {
  categories: PriceCategory[];
}

// ========== Obtener Precios por Categoría ==========
export interface GetPricesByCategoryRequestDTO {
  orgID: string;
  action: 'prices';
  categoriaID: string;
}

export interface GetPricesByCategoryResponseDTO {
  total: number;
  prices: PriceItem[];
}

// ========== Obtener Precios y Categorías ==========
export interface GetPricesAndCategoriesRequestDTO {
  orgID: string;
  action: 'both';
}

export interface GetPricesAndCategoriesResponseDTO {
  categories: PriceCategory[];
  total: number;
  prices: PriceItem[];
}