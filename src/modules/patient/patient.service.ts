import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientEntity } from './entities/patient.entity';
import { Repository } from 'typeorm';
import { PatientProfileEntity } from './entities/patient-profile.entity';
import { AppBaseEntityIdDataType } from '@common/entity/BaseEntity';
@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientEntity)
    private readonly patientRepo: Repository<PatientEntity>,
    @InjectRepository(PatientProfileEntity)
    private readonly patientProfileRepo: Repository<PatientProfileEntity>,
  ) {}

  /**
   * Create a new patient with profile
   */
  async create(createPatientDto: CreatePatientDto): Promise<PatientEntity> {
    const { profile: profileData, ...patientData } = createPatientDto;

    // Check if phone already exists
    if (profileData.phone) {
      const existingProfile = await this.patientProfileRepo.findOne({
        where: { phone: profileData.phone },
      });
      if (existingProfile) {
        throw new ConflictException('Phone number already exists');
      }
    }

    // Create patient
    const patient = this.patientRepo.create(patientData);
    const savedPatient = await this.patientRepo.save(patient);

    // Create profile
    const profile = this.patientProfileRepo.create({
      ...profileData,
      patient: savedPatient,
    });
    await this.patientProfileRepo.save(profile);

    // Return patient with profile
    return this.findOne(savedPatient.id);
  }

  /**
   * Find all patients with their profiles
   */
  async findAll(): Promise<PatientEntity[]> {
    return this.patientRepo.find({
      relations: ['profile', 'owner'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find one patient by ID with profile
   */
  async findOne(id: AppBaseEntityIdDataType): Promise<PatientEntity> {
    const patient = await this.patientRepo.findOne({
      where: { id },
      relations: ['profile', 'owner'],
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return patient;
  }

  /**
   * Update patient and/or profile
   */
  async update(
    id: AppBaseEntityIdDataType,
    updatePatientDto: UpdatePatientDto,
  ): Promise<PatientEntity> {
    const patient = await this.findOne(id);

    const { profile: profileData, ...patientData } = updatePatientDto;

    // Update patient fields
    if (Object.keys(patientData).length > 0) {
      Object.assign(patient, patientData);
      await this.patientRepo.save(patient);
    }

    // Update profile if provided
    if (profileData && Object.keys(profileData).length > 0) {
      if (!patient.profile) {
        throw new BadRequestException('Patient has no profile to update');
      }

      // Check phone uniqueness if updating phone
      if (profileData.phone && profileData.phone !== patient.profile.phone) {
        const existingProfile = await this.patientProfileRepo.findOne({
          where: { phone: profileData.phone },
        });
        if (existingProfile) {
          throw new ConflictException('Phone number already exists');
        }
      }

      Object.assign(patient.profile, profileData);
      await this.patientProfileRepo.save(patient.profile);
    }

    return this.findOne(id);
  }

  /**
   * Remove patient (profile will cascade delete)
   */
  async remove(id: AppBaseEntityIdDataType): Promise<void> {
    const patient = await this.findOne(id);
    await this.patientRepo.remove(patient);
  }
}
