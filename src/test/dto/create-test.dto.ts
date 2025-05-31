export class CreateTestDto {
  name: string;
  price: number;
  testUnitId: string;
  testTypeId: string;
  categoryIds: string[];
  normalRangeMin: number;
  normalRangeMax: number;
}
