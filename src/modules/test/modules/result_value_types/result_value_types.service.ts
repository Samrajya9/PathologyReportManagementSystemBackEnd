import { ResultValueTypeEnum } from '@modules/test/entities/test.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ResultValueTypesService {
  findAll() {
    return Object.keys(ResultValueTypeEnum)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        id: ResultValueTypeEnum[key as keyof typeof ResultValueTypeEnum],
        name: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
      }));
  }
  async findOne(id: number) {
    const entry = Object.keys(ResultValueTypeEnum)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        id: ResultValueTypeEnum[key as keyof typeof ResultValueTypeEnum],
        name: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
      }))
      .find((item) => item.id === id);

    if (!entry) {
      throw new NotFoundException(`ResultValueType with id ${id} not found`);
    }

    return entry;
  }
}
