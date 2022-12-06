import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryEntity } from './category.entity';
export type ProductEntityColumns = keyof ProductEntity;

@Entity({ name: 'Products' })
export class ProductEntity {
  static upsertConflictKeys(): ProductEntityColumns {
    return 'code';
  }

  static upsertKeys(): ProductEntityColumns[] {
    return [
      'description',
      'utility',
      'listPrice',
      'vat',
      'dolar',
      'transport',
      'card',
      'cost',
      'price',
      'cardPrice',
      'bonus',
      'bonus2',
      'cashDiscount',
      'cashDiscount2',
    ];
  }

  @PrimaryGeneratedColumn()
  id?: number;
  @Column({ type: 'bigint' })
  code: number;
  @Column()
  codeString: string;
  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  utility: number;

  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  listPrice: number;

  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  vat: number;

  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  dolar: number;

  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  transport: number;

  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  card: number;

  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  cost: number;

  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  price: number;

  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  cardPrice: number;
  // Temp fields until discounts array can be used.

  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  bonus: number;

  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  bonus2: number;

  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  cashDiscount: number;

  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  cashDiscount2: number;

  // Relations
  @ManyToOne((type) => CategoryEntity)
  category?: CategoryEntity;
}
