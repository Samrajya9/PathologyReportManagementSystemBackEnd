import { OmitType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateResultValueOptionDto {
  @IsNotEmpty()
  value: string;

  @IsOptional()
  isDefault: boolean;

  @IsNotEmpty()
  testId: number;
}

// ✅ Correct usage with tuple type
export class CreateResultValueOptionWithOutTestId extends OmitType(
  CreateResultValueOptionDto,
  ['testId'] as const,
) {}
