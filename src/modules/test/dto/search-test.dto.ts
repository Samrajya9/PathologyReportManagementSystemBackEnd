import { IsOptional, IsString } from 'class-validator';

export class SearchTestDto {
  @IsOptional()
  @IsString()
  name?: string;
}
