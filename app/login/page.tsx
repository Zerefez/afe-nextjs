"use client";

import { Button } from '@/app/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/Card';
import { Input } from '@/app/components/Input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Redirect based on user type
      const accountType = data.user.accountType?.toLowerCase();
      if (accountType === 'manager') {
        router.push('/manager/dashboard');
      } else if (accountType === 'personaltrainer') {
        router.push('/trainer/dashboard');
      } else if (accountType === 'client') {
        router.push('/client/dashboard');
      } else {
        router.push('/');
      }
      
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Sign In</CardTitle>
          <p className="text-center text-gray-500 dark:text-gray-500 mt-3 text-[15px]">
            Access your fitness dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoComplete="email"
            />
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            {error && (
              <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
                <p className="text-[13px] text-gray-700 dark:text-gray-300">{error}</p>
              </div>
            )}
            <Button
              type="submit"
              variant="primary"
              className="w-full mt-6"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-[13px] text-gray-500 dark:text-gray-500 mb-3">
              Test Accounts
            </p>
            <ul className="text-[12px] text-gray-400 dark:text-gray-600 space-y-1.5 font-mono">
              <li>Manager: prefix_boss@fitness.dk</li>
              <li>Trainer: prefix_m@fit.dk</li>
              <li>Client: prefix_c1@fit.dk</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

