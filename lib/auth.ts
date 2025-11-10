// Auth utilities for cookie-based session management
import { cookies } from 'next/headers';
import { Session } from './types';

const SESSION_COOKIE_NAME = 'fitness_session';
const TOKEN_COOKIE_NAME = 'fitness_token';

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

  if (!sessionData || !token) {
    return null;
  }

  try {
    const user = JSON.parse(sessionData);
    return { user, token };
  } catch {
    return null;
  }
}

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE_NAME)?.value || null;
}

export async function setSession(session: Session): Promise<void> {
  const cookieStore = await cookies();
  
  // Set session data (7 days expiry)
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session.user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  // Set token separately
  cookieStore.set(TOKEN_COOKIE_NAME, session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(TOKEN_COOKIE_NAME);
}

