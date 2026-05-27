import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionItem } from '../collections/entities/collection-item.entity';
import { LeafCollection } from '../collections/entities/leaf-collection.entity';
import { Grade } from '../grades/entities/grade.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';

type SeedCollectionItem = {
  gradeName: string;
  weightKg: number;
};

type SeedCollection = {
  supplierName: string;
  collectionDate: string;
  items: SeedCollectionItem[];
};

const QUALITY_POINTS: Record<string, number> = {
  'A Grade': 100,
  'B Grade': 75,
  'C Grade': 50,
  Rejected: 0,
};

const SAMPLE_GRADES = [
  {
    gradeName: 'A Grade',
    ratePerKg: 300,
    description: 'High quality tender leaves',
  },
  {
    gradeName: 'B Grade',
    ratePerKg: 260,
    description: 'Medium quality mixed leaves',
  },
  {
    gradeName: 'C Grade',
    ratePerKg: 220,
    description: 'Lower quality coarse leaves',
  },
  {
    gradeName: 'Rejected',
    ratePerKg: 0,
    description: 'Rejected or damaged leaves',
  },
];

const SAMPLE_SUPPLIERS = [
  {
    name: 'Kumara Bandara',
    phone: '0772341182',
    address: 'Nuwara Eliya',
    status: 'Active',
  },
  {
    name: 'Nimal Perera',
    phone: '0718840021',
    address: 'Hatton',
    status: 'Active',
  },
  {
    name: 'Sunethra Rajapaksha',
    phone: '0761109921',
    address: 'Bandarawela',
    status: 'Active',
  },
  {
    name: 'Anura Silva',
    phone: '0704420118',
    address: 'Ella',
    status: 'Active',
  },
  {
    name: 'Mala Wickrama',
    phone: '0775639920',
    address: 'Haputale',
    status: 'Active',
  },
  {
    name: 'Ravindra Jayasuriya',
    phone: '0758832041',
    address: 'Nuwara Eliya',
    status: 'Inactive',
  },
];

const SAMPLE_COLLECTIONS: SeedCollection[] = [
  {
    supplierName: 'Kumara Bandara',
    collectionDate: '2026-05-23',
    items: [
      { gradeName: 'A Grade', weightKg: 26 },
      { gradeName: 'B Grade', weightKg: 18 },
      { gradeName: 'C Grade', weightKg: 8 },
    ],
  },
  {
    supplierName: 'Nimal Perera',
    collectionDate: '2026-05-23',
    items: [
      { gradeName: 'A Grade', weightKg: 20 },
      { gradeName: 'B Grade', weightKg: 15 },
      { gradeName: 'C Grade', weightKg: 10 },
    ],
  },
  {
    supplierName: 'Sunethra Rajapaksha',
    collectionDate: '2026-05-24',
    items: [
      { gradeName: 'A Grade', weightKg: 14 },
      { gradeName: 'B Grade', weightKg: 12 },
      { gradeName: 'C Grade', weightKg: 7 },
      { gradeName: 'Rejected', weightKg: 5 },
    ],
  },
  {
    supplierName: 'Mala Wickrama',
    collectionDate: '2026-05-24',
    items: [
      { gradeName: 'A Grade', weightKg: 24 },
      { gradeName: 'B Grade', weightKg: 19 },
      { gradeName: 'C Grade', weightKg: 9 },
    ],
  },
  {
    supplierName: 'Anura Silva',
    collectionDate: '2026-05-25',
    items: [
      { gradeName: 'A Grade', weightKg: 11 },
      { gradeName: 'B Grade', weightKg: 13 },
      { gradeName: 'C Grade', weightKg: 10 },
      { gradeName: 'Rejected', weightKg: 6 },
    ],
  },
  {
    supplierName: 'Kumara Bandara',
    collectionDate: '2026-05-25',
    items: [
      { gradeName: 'A Grade', weightKg: 30 },
      { gradeName: 'B Grade', weightKg: 20 },
      { gradeName: 'C Grade', weightKg: 10 },
    ],
  },
  {
    supplierName: 'Nimal Perera',
    collectionDate: '2026-05-25',
    items: [
      { gradeName: 'A Grade', weightKg: 18 },
      { gradeName: 'B Grade', weightKg: 17 },
      { gradeName: 'C Grade', weightKg: 10 },
    ],
  },
  {
    supplierName: 'Ravindra Jayasuriya',
    collectionDate: '2026-05-26',
    items: [
      { gradeName: 'B Grade', weightKg: 16 },
      { gradeName: 'C Grade', weightKg: 14 },
      { gradeName: 'Rejected', weightKg: 8 },
    ],
  },
];

@Injectable()
export class SampleDataService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SampleDataService.name);

  constructor(
    @InjectRepository(Supplier)
    private readonly suppliersRepository: Repository<Supplier>,
    @InjectRepository(Grade)
    private readonly gradesRepository: Repository<Grade>,
    @InjectRepository(LeafCollection)
    private readonly collectionsRepository: Repository<LeafCollection>,
    @InjectRepository(CollectionItem)
    private readonly collectionItemsRepository: Repository<CollectionItem>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedSampleData();
  }

  private async seedSampleData() {
    const [existingGrades, existingSuppliers, collectionCount] = await Promise.all([
      this.gradesRepository.find(),
      this.suppliersRepository.find(),
      this.collectionsRepository.count(),
    ]);

    const existingGradeNames = new Set(existingGrades.map((grade) => grade.gradeName));
    const missingGrades = SAMPLE_GRADES.filter(
      (grade) => !existingGradeNames.has(grade.gradeName),
    );

    if (missingGrades.length > 0) {
      await this.gradesRepository.save(
        missingGrades.map((grade) => this.gradesRepository.create(grade)),
      );
      this.logger.log(`Seeded ${missingGrades.length} missing sample grades.`);
    }

    const existingSupplierNames = new Set(
      existingSuppliers.map((supplier) => supplier.name),
    );
    const missingSuppliers = SAMPLE_SUPPLIERS.filter(
      (supplier) => !existingSupplierNames.has(supplier.name),
    );

    if (missingSuppliers.length > 0) {
      await this.suppliersRepository.save(
        missingSuppliers.map((supplier) =>
          this.suppliersRepository.create(supplier),
        ),
      );
      this.logger.log(
        `Seeded ${missingSuppliers.length} missing sample suppliers.`,
      );
    }

    if (collectionCount > 0) {
      return;
    }

    const grades = await this.gradesRepository.find();
    const suppliers = await this.suppliersRepository.find();

    const gradesByName = new Map(grades.map((grade) => [grade.gradeName, grade]));
    const suppliersByName = new Map(
      suppliers.map((supplier) => [supplier.name, supplier]),
    );

    const seededCollections = SAMPLE_COLLECTIONS.map((entry) => {
      const supplier = suppliersByName.get(entry.supplierName);

      if (!supplier) {
        throw new Error(`Missing supplier while seeding: ${entry.supplierName}`);
      }

      let totalWeight = 0;
      let totalAmount = 0;
      let weightedQuality = 0;

      const items = entry.items.map((item) => {
        const grade = gradesByName.get(item.gradeName);

        if (!grade) {
          throw new Error(`Missing grade while seeding: ${item.gradeName}`);
        }

        const amount = Number((item.weightKg * Number(grade.ratePerKg)).toFixed(2));
        const points = QUALITY_POINTS[grade.gradeName] ?? 0;

        totalWeight += item.weightKg;
        totalAmount += amount;
        weightedQuality += item.weightKg * points;

        return this.collectionItemsRepository.create({
          gradeId: grade.gradeId,
          weightKg: item.weightKg,
          ratePerKg: Number(grade.ratePerKg),
          amount,
          grade,
        });
      });

      const qualityScore =
        totalWeight > 0
          ? Number((weightedQuality / totalWeight).toFixed(2))
          : 0;

      return this.collectionsRepository.create({
        supplierId: supplier.supplierId,
        collectionDate: entry.collectionDate,
        totalWeight: Number(totalWeight.toFixed(2)),
        totalAmount: Number(totalAmount.toFixed(2)),
        qualityScore,
        supplier,
        items,
      });
    });

    await this.collectionsRepository.save(seededCollections);
    this.logger.log('Seeded sample collections.');
  }
}
