/**
 * API Test Helper
 * 
 * Helper functions for testing API endpoints
 */

const BASE_URL = process.env.APP_URL || 'http://localhost:3000';

export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

/**
 * Make an API request
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      data: response.ok ? data : undefined,
      error: !response.ok ? data.error : undefined,
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Test user registration
 */
export async function testRegister(userData: {
  email: string;
  password: string;
  name: string;
  department: string;
}) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

/**
 * Test user login
 */
export async function testLogin(credentials: { email: string; password: string }) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/**
 * Test user logout
 */
export async function testLogout(token: string) {
  return apiRequest('/api/auth/logout', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Generate random email for testing
 */
export function generateTestEmail(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `test-${timestamp}-${random}@test.com`;
}
