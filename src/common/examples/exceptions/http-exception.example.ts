export function HttpExceptionExample(descriptor: {
  message?: string;
  error: string;
  statusCode: number;
}) {
  return descriptor.message
    ? descriptor
    : {
        message: descriptor.error,
        statusCode: descriptor.statusCode,
      };
}
