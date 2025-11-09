// DTOs para la gestión de pagos según la API de Doctoc

// =================== REQUESTS ===================

export interface CreatePaymentRequestDTO {
  action: 'create';
  orgID: string;
  paymentData: {
    patient: string; // ID del paciente
    medico: string; // ID del doctor
    motive: string;
    time: string; // Fecha formato YYYY-MM-DD
    descuento?: number;
    igv?: number;
    moneda: 'Soles' | 'Dolares';
    campos: Array<{
      name: string;
      quantity: number;
      price: number;
      subTotal: number;
    }>;
    pagos: Array<{
      method: string;
      amount: string;
      moneda: 'Soles' | 'Dolares';
    }>;
    person: string; // ID de quien registra
    sedeID?: string;
    status: 'completado' | 'pendiente';
  };
}

export interface GetPatientPaymentsRequestDTO {
  orgID: string;
  patientID: string;
}

export interface GetDayPaymentsRequestDTO {
  orgID: string;
  date: string; // Formato YYYY-MM-DD
}

// =================== RESPONSES ===================

export interface CreatePaymentResponseDTO {
  status: 'success' | 'error';
  message: string;
  receiptID: number;
  receipt: {
    id: number;
    medico: string;
    patient: {
      gender: string;
      dni: string;
      patient_id: string;
      name: string;
      document_type: string;
    };
    motive: string;
    descuento: number;
    descuentoTotal: number;
    time: string;
    files: unknown[];
    person: string;
    register_date: string;
    last_update: string;
    moneda: string;
    igv: number;
    campos: Array<{
      id: number;
      textContent: string;
      unitPrice: number;
      units: number;
      subTotal: number;
      category: string;
      subTotalIGV: number;
      unitPriceIGV: number;
    }>;
    pagos: Array<{
      id: number;
      recipe: string;
      moneda: string;
      person: string;
      amount: string;
      method: string;
      textContent: string;
      pago_register_time: string;
      pago_lastUpdate_time: string;
      cuenta_banco: string;
      categoria: string;
    }>;
    versions: unknown[];
    billing: {
      billingState: boolean;
      initializated: boolean;
      typeDocument: string;
      aditionalInformation: string;
      company: string;
      rucCompany: string;
      domicilio_fiscal_company: string;
      clientData: {
        entityName: string;
        typeIdent: string;
        numberIdent: string;
        address: string;
        mail: string;
        phone: string;
        ubigeoClient: string;
      };
      detraccion: {
        codigo: string;
        porcentaje: string;
        valor_porcentaje: string;
        monto: number;
        codigo_metodo_pago: string;
        nombre_cuenta_bancaria: string;
        cuenta_bancaria: string;
      };
      dues: Array<{
        id: number;
        cuota: string;
        date: string;
        amount: string;
      }>;
      officialDocuments: Record<string, unknown>;
    };
    sedeID: string;
  };
}

export interface GetPatientPaymentsResponseDTO {
  status: 'success' | 'error';
  total: number;
  totalAmount: number;
  pendingAmount: number;
  payments: Array<{
    files: unknown[];
    id: string;
    patient: string;
    medico: string;
    motive: string;
    time: string;
    descuento: number;
    subtotal: number;
    total: number;
    moneda: string;
    igv: number;
    campos: Array<{
      name: string;
      quantity: number;
      price: number;
      subTotal: number;
    }>;
    person: string;
    status: string;
    sedeID: string;
    register_date: string;
    last_update: string;
    versions: Array<{
      timestamp: string;
      action: string;
      createdBy: string;
    }>;
    pagos: Array<{
      id: string;
      receiptId: string;
      moneda: string;
      person: string;
      amount: string;
      method: string;
      textContent: string;
      pago_register_time: string;
      pago_lastUpdate_time: string;
      cuenta_banco: string;
      categoria: string;
    }>;
  }>;
}

export interface GetDayPaymentsResponseDTO {
  status: 'success' | 'error';
  total?: number;
  totalAmount?: number;
  pendingAmount?: number;
  payments?: Array<{
    files: unknown[];
    id: string;
    patient: string;
    medico: string;
    motive: string;
    time: string;
    descuento: number;
    subtotal: number;
    total: number;
    moneda: string;
    igv: number;
    campos: Array<{
      name: string;
      quantity: number;
      price: number;
      subTotal: number;
    }>;
    person: string;
    status: string;
    sedeID: string;
    register_date: string;
    last_update: string;
    versions: Array<{
      timestamp: string;
      action: string;
      createdBy: string;
    }>;
    pagos: Array<{
      id: string;
      receiptId: string;
      moneda: string;
      person: string;
      amount: string;
      method: string;
      textContent: string;
      pago_register_time: string;
      pago_lastUpdate_time: string;
      cuenta_banco: string;
      categoria: string;
    }>;
  }>;
}