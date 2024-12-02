import {
  Injectable,
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import parse from 'parse-duration';

@Injectable()
export class MinAgeDatePipe implements PipeTransform {
  private readonly minString: string;
  private readonly min: number;
  private readonly replace: boolean = false;
  private readonly optional: boolean = false;

  public constructor(
    min: string,
    options?: { replace?: boolean; optional?: boolean },
  ) {
    const minParsed = parse(min);
    if (minParsed === null) {
      throw new Error('Invalid duration string');
    }
    this.minString = min;
    this.min = minParsed;
    this.replace = options?.replace ?? false;
    this.optional = options?.optional ?? false;
  }

  public transform(
    value: Date | undefined,
    metadata: ArgumentMetadata,
  ): Date | undefined {
    if (value === undefined) {
      if (this.optional) {
        return value;
      } else {
        throw new BadRequestException(`${metadata.data} is required.`);
      }
    }
    const maxDate = new Date(Date.now() - this.min);

    const ret = value > maxDate ? maxDate : value;

    if (ret !== value && !this.replace) {
      throw new BadRequestException(
        `${metadata.data} must be at least ${this.minString}.`,
      );
    }

    return ret;
  }
}
