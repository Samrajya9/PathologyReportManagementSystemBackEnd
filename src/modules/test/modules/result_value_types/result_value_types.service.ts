import { ResultValueTypeEnum } from '@common/enums/result-value-type.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResultValueTypesService {
  findAll() {
    return Object.keys(ResultValueTypeEnum).map((key) => ({
      id: key,
      name:
        ResultValueTypeEnum[key as keyof typeof ResultValueTypeEnum]
          .charAt(0)
          .toUpperCase() +
        ResultValueTypeEnum[key as keyof typeof ResultValueTypeEnum]
          .slice(1)
          .toLocaleLowerCase(),
    }));
  }
}
