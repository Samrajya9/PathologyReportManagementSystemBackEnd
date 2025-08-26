import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateResultValueOptionDto } from './dto/create-result_value_option.dto';
import { UpdateResultValueOptionDto } from './dto/update-result_value_option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultValueOptionEntity } from './entities/result_value_option.entity';
import { Repository } from 'typeorm';
import { TestEntity } from 'src/test/entities/test.entity';
import { TestService } from 'src/test/test.service';
import { refCount } from 'rxjs';

@Injectable()
export class ResultValueOptionsService {
  constructor(
    @InjectRepository(ResultValueOptionEntity)
    private readonly resultValueOptionRepo: Repository<ResultValueOptionEntity>,

    @Inject(forwardRef(() => TestService))
    private readonly testService: TestService,
  ) {}

  async create(
    createResultValueOptionDto: Omit<CreateResultValueOptionDto, 'testId'>,
    test: TestEntity,
  ) {
    const resultValueOption = this.resultValueOptionRepo.create({
      ...createResultValueOptionDto,
      test,
    });
    const newResultValueOption =
      await this.resultValueOptionRepo.save(resultValueOption);
    return newResultValueOption;
  }
  async createFromUrl(createResultValueOptionDto: CreateResultValueOptionDto) {
    const { testId, ...data } = createResultValueOptionDto;
    const test = await this.testService.findOne(testId);
    const newResultValueOption = await this.create(data, test);
    return newResultValueOption;
  }

  findAll() {
    return `This action returns all resultValueOptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resultValueOption`;
  }

  update(id: number, updateResultValueOptionDto: UpdateResultValueOptionDto) {
    return `This action updates a #${id} resultValueOption`;
  }

  remove(id: number) {
    return `This action removes a #${id} resultValueOption`;
  }
}
