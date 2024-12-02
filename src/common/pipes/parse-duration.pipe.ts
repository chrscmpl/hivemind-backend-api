import {
  Injectable,
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import parse from 'parse-duration';

@Injectable()
export class ParseDurationPipe implements PipeTransform {
  private readonly optional: boolean = false;

  public constructor(options?: { optional?: boolean }) {
    this.optional = options?.optional ?? false;
  }

  public transform(
    value: string | undefined,
    metadata: ArgumentMetadata,
  ): number | undefined {
    if (!value) {
      if (this.optional) {
        return undefined;
      } else {
        throw new Error(`${metadata.data} is required.`);
      }
    }

    const ret = parse(value);

    if (ret === null) {
      throw new BadRequestException(
        `${metadata.data} must be a valid duration string.`,
      );
    }

    return ret;
  }
}
