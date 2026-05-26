import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Grade } from './entities/grade.entity';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Grade)
    private readonly gradesRepository: Repository<Grade>,
  ) {}

  create(createGradeDto: CreateGradeDto) {
    const grade = this.gradesRepository.create(createGradeDto);
    return this.gradesRepository.save(grade);
  }

  findAll() {
    return this.gradesRepository.find({
      order: {
        gradeId: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const grade = await this.gradesRepository.findOne({
      where: { gradeId: id },
    });

    if (!grade) {
      throw new NotFoundException(`Grade ${id} not found`);
    }

    return grade;
  }

  async update(id: number, updateGradeDto: UpdateGradeDto) {
    const grade = await this.findOne(id);
    Object.assign(grade, updateGradeDto);
    return this.gradesRepository.save(grade);
  }

  async remove(id: number) {
    const grade = await this.findOne(id);
    await this.gradesRepository.remove(grade);
    return { deleted: true };
  }
}
