import { AES, enc } from 'crypto-js';
import { z } from 'zod';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-for-dev';

// Data validation schemas
export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional()
});

export const callSchema = z.object({
  phoneNumber: z.string(),
  duration: z.number().min(0),
  status: z.enum(['success', 'failed', 'pending']),
  type: z.enum(['inbound', 'outbound']),
  notes: z.string().optional()
});

// Security utilities
export const securityUtils = {
  encryptData: (data: any): string => {
    return AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
  },

  decryptData: (encryptedData: string): any => {
    const bytes = AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(enc.Utf8));
  },

  sanitizeInput: (input: string): string => {
    return input.replace(/[<>]/g, '');
  },

  validateData: <T>(schema: z.Schema<T>, data: unknown): T => {
    return schema.parse(data);
  },

  hashPhoneNumber: (phoneNumber: string): string => {
    return phoneNumber.replace(/\d(?=\d{4})/g, '*');
  }
};

// Rate limiting
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private limit: number;
  private window: number;

  constructor(limit: number = 100, windowMs: number = 60000) {
    this.limit = limit;
    this.window = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(key) || [];
    
    // Remove old timestamps
    const validTimestamps = timestamps.filter(t => now - t < this.window);
    
    if (validTimestamps.length < this.limit) {
      validTimestamps.push(now);
      this.requests.set(key, validTimestamps);
      return true;
    }
    
    return false;
  }
}

export const apiRateLimiter = new RateLimiter();