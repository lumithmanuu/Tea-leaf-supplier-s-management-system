import { CreateCollectionItemDto } from './create-collection-item.dto';

export class CreateCollectionDto {
  supplierId!: number;
  collectionDate!: string;
  items!: CreateCollectionItemDto[];
}
