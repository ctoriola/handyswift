import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/supabase';

export interface AuthRequest extends Request {
  userId?: string;
  token?: string;
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): Promise<void | Response> {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Missing or invalid authorization token',
        statusCode: 401,
      });
    }

    const token = authHeader.substring(7);
    const user = await verifyToken(token);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'INVALID_TOKEN',
        message: 'Token is invalid or expired',
        statusCode: 401,
      });
    }

    req.userId = user.id;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'AUTH_ERROR',
      message: 'Authentication failed',
      statusCode: 401,
    });
  }
}
