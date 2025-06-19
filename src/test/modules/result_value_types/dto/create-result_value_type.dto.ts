import { IsOptional } from 'class-validator';

export class CreateResultValueTypeDto {
  @IsOptional()
  name: string;
}
