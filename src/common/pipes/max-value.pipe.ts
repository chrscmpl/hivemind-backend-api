import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class MaxValuePipe implements PipeTransform {
  constructor(private readonly max: number) {}

  transform(value: number) {
    try {
      return value > this.max ? this.max : value;
    } catch {
      throw new BadRequestException(`${value} is not a valid number.`);
    }
  }
}
