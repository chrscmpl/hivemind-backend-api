import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class MinValuePipe implements PipeTransform {
  constructor(private readonly min: number) {}

  transform(value: number) {
    try {
      return value < this.min ? this.min : value;
    } catch {
      throw new BadRequestException(`${value} is not a valid number.`);
    }
  }
}
