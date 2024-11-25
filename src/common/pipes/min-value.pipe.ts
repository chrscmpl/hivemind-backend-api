import {
  Injectable,
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class MinValuePipe implements PipeTransform {
  private readonly min: number;
  private readonly replace: boolean;

  public constructor(min: number, options?: { replace?: boolean }) {
    this.min = min;
    this.replace = options?.replace ?? false;
  }

  public transform(value: number, metadata: ArgumentMetadata) {
    const ret = value < this.min ? this.min : value;

    if (ret !== value && !this.replace) {
      throw new BadRequestException(
        `${metadata.data} must be greater than or equal to ${this.min}.`,
      );
    }

    return ret;
  }
}
