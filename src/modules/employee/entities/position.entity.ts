import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmployeeEntity } from './employee.entity';

@Entity('position')
export class PositionEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: 'Primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @OneToMany((type) => EmployeeEntity, (employee) => employee.position)
  employees: EmployeeEntity[];

  @Column({ type: 'timestamp', nullable: false, default: () => 'NOW()' })
  createdAt: string;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}
