import { PartialType } from '@nestjs/mapped-types';
import { CreateTestSpecimenContainerDto } from './create-test_specimen_container.dto';

export class UpdateTestSpecimenContainerDto extends PartialType(CreateTestSpecimenContainerDto) {}
