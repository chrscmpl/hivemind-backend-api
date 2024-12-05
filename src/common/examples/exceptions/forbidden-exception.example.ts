import { HttpExceptionExample } from './http-exception.example';

export function ForbiddenExceptionExample(message?: string | string[]) {
  return HttpExceptionExample({
    message,
    error: 'Forbidden',
    statusCode: 403,
  });
}
