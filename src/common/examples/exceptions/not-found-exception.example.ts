import { HttpExceptionExample } from './http-exception.example';

export function NotFoundExceptionExample(message?: string) {
  return HttpExceptionExample({
    message,
    error: 'Not Found',
    statusCode: 404,
  });
}
