import { NextRequest, NextResponse } from 'next/server';
import { clearSession } from '@/shared/lib/auth';

export async function GET(request: NextRequest) {
  await clearSession();
  const url = new URL('/login', request.url);
  return NextResponse.redirect(url);
}

