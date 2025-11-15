/**
 * Environment configuration
 * Centralized environment variable handling
 */

export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://assignment2.swafe.dk',
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

