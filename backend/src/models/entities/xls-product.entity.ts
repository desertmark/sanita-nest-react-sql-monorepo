import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('XlsProducts')
export class XlsProduct {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column('bigint')
  codigo: number;
  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  precio: number;
  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  bonificacion: number;
  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  bonificacion2: number;
}
