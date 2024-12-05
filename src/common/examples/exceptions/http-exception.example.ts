export function HttpExceptionExample(descriptor: {
  message?: string | string[];
  error: string;
  statusCode: number;
}) {
  return descriptor.message?.length
    ? descriptor
    : {
        message: descriptor.error,
        statusCode: descriptor.statusCode,
      };
}
