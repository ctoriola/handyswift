import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials in environment variables');
}

// Service role client (for server operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Function to create client with user's auth token
export function createClientWithAuth(token: string) {
  return createClient(supabaseUrl || '', process.env.SUPABASE_ANON_KEY || '', {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}

// Function to verify JWT token
export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}
