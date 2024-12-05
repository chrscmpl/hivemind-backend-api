import { HttpExceptionExample } from './http-exception.example';

export function UnauthorizedExceptionExample(message?: string | string[]) {
  return HttpExceptionExample({
    message,
    error: 'Unauthorized',
    statusCode: 401,
  });
}
