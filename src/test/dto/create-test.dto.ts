import { GlobalEntityIdDataType } from 'src/global/entity/BaseEntity';

export class CreateTestDto {
  //   @IsString()
  name: string;

  //   @IsUUID()
  testUnitId: string;

  //   @IsUUID()
  testTypeId: string;

  //   @IsUUID({}, { each: true })
  categoryIds: string[];
}
