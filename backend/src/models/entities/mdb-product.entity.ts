import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IMdbProduct } from '../mdb-product';

@Entity({ name: 'MdbProducts' })
export class MdbProduct implements IMdbProduct {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  codigo: string;
  @Column('bigint')
  codigoNumero: number;
  @Column()
  descripcion: string;
  @Column()
  rubro: string;
  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  precio: number;

  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  precioTarjeta: number;

  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  bonif: number;
  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  bonif2: number;
  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  caja1: number;
  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  caja2: number;
  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  costo: number;
  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  utilidad: number;
  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  pl: number;
  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  iva: number;
  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  dolar: number;
  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  flete: number;
  @Column({ type: 'decimal', precision: 20, scale: 10, default: 0 })
  tarjeta: number;
}
