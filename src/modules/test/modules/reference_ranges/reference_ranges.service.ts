import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateReferenceRangeDto,
  CreateReferenceRangeDtoWithoutTestId,
} from './dto/create-reference_range.dto';
import { UpdateReferenceRangeDto } from './dto/update-reference_range.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReferenceRangeEntity } from './entities/reference_range.entity';
import { Repository } from 'typeorm';
import {
  AppBaseEntity,
  AppBaseEntityIdDataType,
} from '@common/entity/BaseEntity';
import { TestService } from '@modules/test/test.service';
import { TestEntity } from '@modules/test/entities/test.entity';

@Injectable()
export class ReferenceRangesService {
  constructor(
    @InjectRepository(ReferenceRangeEntity)
    private readonly refRangeRepo: Repository<ReferenceRangeEntity>,
    @Inject(forwardRef(() => TestService))
    private readonly testService: TestService,
  ) {}
  async createByTestId(createReferenceRangeDto: CreateReferenceRangeDto) {
    const { testId, ...refRangeData } = createReferenceRangeDto;
    const test = await this.testService.findOne(testId);
    const newRefRange = this.refRangeRepo.create({ ...refRangeData, test });
    return await this.refRangeRepo.save(newRefRange);
  }

  async create(
    refRangeData: CreateReferenceRangeDtoWithoutTestId,
    test: TestEntity,
  ) {
    const newRefRange = this.refRangeRepo.create({ ...refRangeData, test });
    return await this.refRangeRepo.save(newRefRange);
  }

  async findAll() {
    return await this.refRangeRepo.find();
  }

  async findOne(id: number) {
    const refRange = await this.refRangeRepo.findOne({ where: { id } });
    if (!refRange)
      throw new NotFoundException(`Ref Range with ${id} not found`);
    return refRange;
  }

  async update(
    id: number,
    test: TestEntity,
    updateReferenceRangeDto: UpdateReferenceRangeDto,
  ) {
    const refRange = await this.findOne(id);
    const updateRefRang = this.refRangeRepo.merge(refRange, {
      ...updateReferenceRangeDto,
      test,
    });
    return await this.refRangeRepo.save(updateRefRang);
  }

  async findByTestId(testId: AppBaseEntityIdDataType) {
    return await this.refRangeRepo.find({ where: { test: { id: testId } } });
  }

  async remove(id: number) {
    return await this.refRangeRepo.delete({ id });
  }
}
