import { Transform } from 'class-transformer';
import * as sanitizeHtml from 'sanitize-html';

export function Sanitize(): PropertyDecorator {
  return Transform(({ value }) => sanitizeHtml(value));
}
