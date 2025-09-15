import { NextRequest } from 'next/server';

// Definição dos parâmetros obrigatórios para cada endpoint
export const REQUIRED_PARAMS: Record<string, string[]> = {
  // Endpoints de dados financeiros por período (bulk data)
  '/accounts-statements': ['startDate', 'endDate'],
  '/income': ['startDate', 'endDate', 'selectionType'],
  '/bank-movement': ['startDate', 'endDate'],
  '/customer-extract-history': ['startDueDate', 'endDueDate'],

  // Endpoints de vendas (bulk data)
  '/sales': ['enterpriseId', 'createdAfter', 'createdBefore', 'situation'],
  '/sales-contracts': [], // Endpoint opcional - não requer parâmetros obrigatórios

  // Endpoints de medições e anexos (bulk data)
  '/supply-contracts/measurements/attachments/all': [
    'measurementStartDate',
    'measurementEndDate',
  ],
};

// Validar parâmetros obrigatórios para um endpoint
export function validateRequiredParams(
  endpoint: string,
  searchParams: URLSearchParams
): { isValid: boolean; missingParams: string[] } {
  const requiredParams = REQUIRED_PARAMS[endpoint];

  if (!requiredParams) {
    return { isValid: true, missingParams: [] };
  }

  const missingParams: string[] = [];

  for (const param of requiredParams) {
    if (!searchParams.has(param) || searchParams.get(param) === '') {
      missingParams.push(param);
    }
  }

  return {
    isValid: missingParams.length === 0,
    missingParams,
  };
}

// Validar formato de datas
export function validateDateParams(params: Record<string, any>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const dateParams = [
    'startDate',
    'endDate',
    'createdAfter',
    'createdBefore',
    'measurementStartDate',
    'measurementEndDate',
    'startDueDate',
    'endDueDate',
    'initialIssueDate',
    'finalIssueDate',
    'initialCancelDate',
    'finalCancelDate',
    'modifiedAfter',
    'modifiedBefore',
  ];

  for (const param of dateParams) {
    if (params[param]) {
      const date = new Date(params[param]);
      if (isNaN(date.getTime())) {
        errors.push(`Parâmetro '${param}' deve estar no formato yyyy-MM-dd`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validar arrays de IDs
export function validateArrayParams(params: Record<string, any>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const arrayParams = ['billsIds', 'movementsIds', 'costCentersId'];

  for (const param of arrayParams) {
    if (params[param]) {
      const value = params[param];
      if (typeof value === 'string') {
        // Verificar se é uma string de números separados por vírgula
        const numbers = value.split(',').map(n => n.trim());
        for (const num of numbers) {
          if (isNaN(Number(num))) {
            errors.push(
              `Parâmetro '${param}' deve conter números separados por vírgula (ex: 1,2,3)`
            );
            break;
          }
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Função principal de validação
export function validateSiengeParams(
  endpoint: string,
  searchParams: URLSearchParams
): {
  isValid: boolean;
  errors: string[];
  missingParams: string[];
} {
  // Converter searchParams para objeto
  const params: Record<string, any> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  // Validar parâmetros obrigatórios
  const requiredValidation = validateRequiredParams(endpoint, searchParams);

  // Validar formato de datas
  const dateValidation = validateDateParams(params);

  // Validar arrays
  const arrayValidation = validateArrayParams(params);

  const allErrors = [...dateValidation.errors, ...arrayValidation.errors];

  // Se há parâmetros obrigatórios faltando, adicionar erro
  if (requiredValidation.missingParams.length > 0) {
    allErrors.push(
      `Parâmetros obrigatórios faltando: ${requiredValidation.missingParams.join(', ')}`
    );
  }

  return {
    isValid:
      requiredValidation.isValid &&
      dateValidation.isValid &&
      arrayValidation.isValid,
    errors: allErrors,
    missingParams: requiredValidation.missingParams,
  };
}
