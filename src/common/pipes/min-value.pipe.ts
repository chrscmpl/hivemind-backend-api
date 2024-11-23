import {
  Injectable,
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class MinValuePipe implements PipeTransform {
  private readonly min: number;
  private readonly strict: boolean;

  public constructor(min: number, options?: { strict?: boolean }) {
    this.min = min;
    this.strict = options?.strict ?? false;
  }

  public transform(value: number, metadata: ArgumentMetadata) {
    const ret = value < this.min ? this.min : value;

    if (ret !== value && this.strict) {
      throw new BadRequestException(
        `The value of ${metadata.data} must be greater than or equal to ${this.min}.`,
      );
    }

    return ret;
  }
}
