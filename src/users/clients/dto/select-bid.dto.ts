import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';

export class SelectBidDto {
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  ids: number[];
}
