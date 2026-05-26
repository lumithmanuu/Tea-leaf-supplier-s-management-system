import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Grade } from '../grades/entities/grade.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CollectionItem } from './entities/collection-item.entity';
import { LeafCollection } from './entities/leaf-collection.entity';

const QUALITY_POINTS: Record<string, number> = {
  'A Grade': 100,
  'B Grade': 75,
  'C Grade': 50,
  Rejected: 0,
};

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(LeafCollection)
    private readonly collectionsRepository: Repository<LeafCollection>,
    @InjectRepository(CollectionItem)
    private readonly collectionItemsRepository: Repository<CollectionItem>,
    @InjectRepository(Supplier)
    private readonly suppliersRepository: Repository<Supplier>,
    @InjectRepository(Grade)
    private readonly gradesRepository: Repository<Grade>,
  ) {}

  async create(createCollectionDto: CreateCollectionDto) {
    if (!createCollectionDto.items?.length) {
      throw new BadRequestException(
        'At least one grade item is required for a collection',
      );
    }

    const supplier = await this.suppliersRepository.findOne({
      where: { supplierId: createCollectionDto.supplierId },
    });

    if (!supplier) {
      throw new BadRequestException('Selected supplier does not exist');
    }

    const gradeIds = createCollectionDto.items.map((item) => item.gradeId);
    const grades = await this.gradesRepository.findBy({
      gradeId: In(gradeIds),
    });

    if (grades.length !== gradeIds.length) {
      throw new BadRequestException('One or more selected grades do not exist');
    }

    const gradesById = new Map(grades.map((grade) => [grade.gradeId, grade]));

    let totalWeight = 0;
    let totalAmount = 0;
    let qualityWeight = 0;

    const items = createCollectionDto.items.map((itemDto) => {
      const grade = gradesById.get(itemDto.gradeId);

      if (!grade) {
        throw new BadRequestException(`Grade ${itemDto.gradeId} not found`);
      }

      const weightKg = Number(itemDto.weightKg);
      const ratePerKg = Number(grade.ratePerKg);
      const amount = Number((weightKg * ratePerKg).toFixed(2));
      const qualityPoint = QUALITY_POINTS[grade.gradeName] ?? 0;

      totalWeight += weightKg;
      totalAmount += amount;
      qualityWeight += weightKg * qualityPoint;

      return this.collectionItemsRepository.create({
        gradeId: grade.gradeId,
        weightKg,
        ratePerKg,
        amount,
        grade,
      });
    });

    const qualityScore =
      totalWeight > 0 ? Number((qualityWeight / totalWeight).toFixed(2)) : 0;

    const collection = this.collectionsRepository.create({
      supplierId: supplier.supplierId,
      collectionDate: createCollectionDto.collectionDate,
      totalWeight: Number(totalWeight.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
      qualityScore,
      supplier,
      items,
    });

    return this.collectionsRepository.save(collection);
  }

  findAll() {
    return this.collectionsRepository.find({
      relations: {
        supplier: true,
        items: {
          grade: true,
        },
      },
      order: {
        collectionDate: 'DESC',
        collectionId: 'DESC',
      },
    });
  }

  findBySupplier(supplierId: number) {
    return this.collectionsRepository.find({
      where: { supplierId },
      relations: {
        supplier: true,
        items: {
          grade: true,
        },
      },
      order: {
        collectionDate: 'DESC',
        collectionId: 'DESC',
      },
    });
  }
}
