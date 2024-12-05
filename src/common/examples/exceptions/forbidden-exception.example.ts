import { HttpExceptionExample } from './http-exception.example';

export function ForbiddenExceptionExample(message?: string) {
  return HttpExceptionExample({
    message,
    error: 'Forbidden',
    statusCode: 403,
  });
}
