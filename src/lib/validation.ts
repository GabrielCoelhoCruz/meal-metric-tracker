import { z } from 'zod';

// Input validation schemas
export const quantitySchema = z.number()
  .min(0, 'Quantidade deve ser maior ou igual a zero')
  .max(10000, 'Quantidade muito alta')
  .finite('Quantidade deve ser um número válido');

export const mealIdSchema = z.string()
  .min(1, 'ID da refeição é obrigatório')
  .max(100, 'ID da refeição muito longo')
  .regex(/^[a-zA-Z0-9_-]+$/, 'ID da refeição contém caracteres inválidos');

export const foodIdSchema = z.string()
  .min(1, 'ID do alimento é obrigatório')
  .max(100, 'ID do alimento muito longo')
  .regex(/^[a-zA-Z0-9_-]+$/, 'ID do alimento contém caracteres inválidos');

export const searchQuerySchema = z.string()
  .max(200, 'Consulta de busca muito longa')
  .regex(/^[^<>{}]*$/, 'Consulta contém caracteres não permitidos');

export const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (use YYYY-MM-DD)');

// Validation helper functions
export function validateQuantity(value: unknown): number {
  return quantitySchema.parse(value);
}

export function validateMealId(value: unknown): string {
  return mealIdSchema.parse(value);
}

export function validateFoodId(value: unknown): string {
  return foodIdSchema.parse(value);
}

export function validateSearchQuery(value: unknown): string {
  return searchQuerySchema.parse(value);
}

export function validateDate(value: unknown): string {
  return dateSchema.parse(value);
}

// Sanitization functions
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .trim();
}

export function sanitizeNumber(input: unknown): number {
  const num = Number(input);
  if (!Number.isFinite(num)) {
    throw new Error('Valor deve ser um número válido');
  }
  return num;
}