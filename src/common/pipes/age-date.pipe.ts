import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class AgeDatePipe implements PipeTransform {
  private readonly optional: boolean = false;

  public constructor(options?: { optional?: boolean }) {
    this.optional = options?.optional ?? false;
  }

  public transform(
    value: number | undefined,
    metadata: ArgumentMetadata,
  ): Date | undefined {
    if (value === undefined) {
      if (this.optional) {
        return value;
      } else {
        throw new Error(`${metadata.data} is required.`);
      }
    }
    return new Date(Date.now() - value);
  }
}
