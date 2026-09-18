// The only place the client talks to the API. Same origin + credentials: 'include' means the
// browser sends the HttpOnly "token" cookie itself; the client never sees or stores a token.
export class ApiError extends Error {
  readonly status: number;
  readonly issues: unknown;

  constructor(status: number, message: string, issues?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.issues = issues;
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    credentials: 'include',
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  });

  if (response.status === 204) return undefined as T;

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const body = (data ?? {}) as { error?: string; issues?: unknown };
    throw new ApiError(
      response.status,
      body.error ?? `Request failed (${response.status})`,
      body.issues,
    );
  }
  return data as T;
}
