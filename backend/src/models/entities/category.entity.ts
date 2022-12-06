import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Categories' })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  description: string;
}
