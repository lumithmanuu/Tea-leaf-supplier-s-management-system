import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './entities/supplier.entity';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly suppliersRepository: Repository<Supplier>,
  ) {}

  create(createSupplierDto: CreateSupplierDto) {
    const supplier = this.suppliersRepository.create({
      ...createSupplierDto,
      status: createSupplierDto.status ?? 'Active',
    });

    return this.suppliersRepository.save(supplier);
  }

  findAll() {
    return this.suppliersRepository.find({
      order: {
        supplierId: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const supplier = await this.suppliersRepository.findOne({
      where: { supplierId: id },
      relations: {
        collections: {
          items: {
            grade: true,
          },
        },
      },
      order: {
        collections: {
          collectionDate: 'DESC',
        },
      },
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier ${id} not found`);
    }

    return supplier;
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.findOne(id);
    Object.assign(supplier, updateSupplierDto);
    return this.suppliersRepository.save(supplier);
  }

  async remove(id: number) {
    const supplier = await this.findOne(id);
    supplier.status = 'Inactive';
    return this.suppliersRepository.save(supplier);
  }
}
