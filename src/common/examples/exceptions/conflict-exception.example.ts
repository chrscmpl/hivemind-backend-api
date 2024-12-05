import { HttpExceptionExample } from './http-exception.example';

export function ConflictExceptionExample(message?: string) {
  return HttpExceptionExample({
    message,
    error: 'Conflict',
    statusCode: 409,
  });
}
