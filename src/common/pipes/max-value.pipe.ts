import {
  Injectable,
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class MaxValuePipe implements PipeTransform {
  private readonly max: number;
  private readonly replace: boolean;

  public constructor(max: number, options?: { replace?: boolean }) {
    this.max = max;
    this.replace = options?.replace ?? false;
  }

  public transform(value: number, metadata: ArgumentMetadata) {
    const ret = value > this.max ? this.max : value;

    if (ret !== value && !this.replace) {
      throw new BadRequestException(
        `${metadata.data} must be less than or equal to ${this.max}.`,
      );
    }

    return ret;
  }
}
