import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeafCollection } from '../collections/entities/leaf-collection.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(LeafCollection)
    private readonly collectionsRepository: Repository<LeafCollection>,
  ) {}

  async getDashboardSummary() {
    const collections = await this.collectionsRepository.find({
      relations: {
        supplier: true,
        items: {
          grade: true,
        },
      },
    });

    const today = new Date().toISOString().slice(0, 10);
    const monthKey = today.slice(0, 7);

    const todayCollections = collections.filter(
      (collection) => collection.collectionDate === today,
    );
    const monthCollections = collections.filter((collection) =>
      collection.collectionDate.startsWith(monthKey),
    );

    const totalRejectedWeight = collections.flatMap((collection) => collection.items).reduce(
      (sum, item) => sum + (item.grade.gradeName === 'Rejected' ? Number(item.weightKg) : 0),
      0,
    );

    const totalWeight = collections.reduce(
      (sum, collection) => sum + Number(collection.totalWeight),
      0,
    );

    const rankedSuppliers = this.buildSupplierRanking(monthCollections);

    return {
      todayTotalLeafCollection: this.sumBy(todayCollections, 'totalWeight'),
      todayTotalSupplierPayment: this.sumBy(todayCollections, 'totalAmount'),
      thisMonthTotalCollection: this.sumBy(monthCollections, 'totalWeight'),
      thisMonthTotalSupplierPayment: this.sumBy(monthCollections, 'totalAmount'),
      averageSupplierQualityScore:
        monthCollections.length > 0
          ? Number(
              (
                monthCollections.reduce(
                  (sum, collection) => sum + Number(collection.qualityScore),
                  0,
                ) / monthCollections.length
              ).toFixed(2),
            )
          : 0,
      rejectedLeafPercentage:
        totalWeight > 0
          ? Number(((totalRejectedWeight / totalWeight) * 100).toFixed(2))
          : 0,
      bestQualitySupplier: rankedSuppliers[0] ?? null,
      lowestQualitySupplier:
        rankedSuppliers.length > 0 ? rankedSuppliers[rankedSuppliers.length - 1] : null,
    };
  }

  async getSupplierRanking() {
    const collections = await this.collectionsRepository.find({
      relations: {
        supplier: true,
      },
    });

    return this.buildSupplierRanking(collections);
  }

  async getGradeWiseCollection() {
    const collections = await this.collectionsRepository.find({
      relations: {
        items: {
          grade: true,
        },
      },
    });

    const totals = new Map<
      string,
      { gradeName: string; totalWeight: number; totalAmount: number }
    >();

    for (const collection of collections) {
      for (const item of collection.items) {
        const current = totals.get(item.grade.gradeName) ?? {
          gradeName: item.grade.gradeName,
          totalWeight: 0,
          totalAmount: 0,
        };

        current.totalWeight += Number(item.weightKg);
        current.totalAmount += Number(item.amount);
        totals.set(item.grade.gradeName, current);
      }
    }

    return [...totals.values()].map((entry) => ({
      ...entry,
      totalWeight: Number(entry.totalWeight.toFixed(2)),
      totalAmount: Number(entry.totalAmount.toFixed(2)),
    }));
  }

  private sumBy(collections: LeafCollection[], key: 'totalWeight' | 'totalAmount') {
    return Number(
      collections
        .reduce((sum, collection) => sum + Number(collection[key]), 0)
        .toFixed(2),
    );
  }

  private buildSupplierRanking(collections: LeafCollection[]) {
    const summary = new Map<
      number,
      { supplierId: number; supplierName: string; averageQualityScore: number; collections: number }
    >();

    for (const collection of collections) {
      const current = summary.get(collection.supplierId) ?? {
        supplierId: collection.supplierId,
        supplierName: collection.supplier?.name ?? `Supplier ${collection.supplierId}`,
        averageQualityScore: 0,
        collections: 0,
      };

      current.averageQualityScore += Number(collection.qualityScore);
      current.collections += 1;
      summary.set(collection.supplierId, current);
    }

    return [...summary.values()]
      .map((entry) => ({
        ...entry,
        averageQualityScore: Number(
          (entry.averageQualityScore / entry.collections).toFixed(2),
        ),
      }))
      .sort((a, b) => b.averageQualityScore - a.averageQualityScore);
  }
}
