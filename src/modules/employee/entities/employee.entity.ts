import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PositionEntity } from './position.entity';

@Entity('employee')
export class EmployeeEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: 'Primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ManyToOne((type) => PositionEntity, (position) => position.employees)
  @JoinColumn({ name: 'positionId' })
  position: PositionEntity;

  @ManyToOne((type) => EmployeeEntity, (employee) => employee.children)
  @JoinColumn({ name: 'parentId' })
  parent: EmployeeEntity;

  @OneToMany((type) => EmployeeEntity, (employee) => employee.parent)
  children: EmployeeEntity[];

  @Column({ type: 'timestamp', nullable: false, default: () => 'NOW()' })
  createdAt: string;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}
