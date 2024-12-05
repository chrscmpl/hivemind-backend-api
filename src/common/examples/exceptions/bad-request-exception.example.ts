import { HttpExceptionExample } from './http-exception.example';

export function BadRequestExceptionExample(message?: string) {
  return HttpExceptionExample({
    message,
    error: 'Bad Request',
    statusCode: 400,
  });
}
