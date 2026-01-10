import { Response } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
  timestamp: string;
}

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode: number = 200): Response {
  return res.status(statusCode).json({
    success: true,
    data,
    message: message || 'Success',
    statusCode,
    timestamp: new Date().toISOString(),
  });
}

export function sendError(res: Response, error: string, message: string, statusCode: number = 400): Response {
  return res.status(statusCode).json({
    success: false,
    error,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
  });
}
