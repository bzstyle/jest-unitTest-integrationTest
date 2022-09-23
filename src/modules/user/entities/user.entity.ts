import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: true,
    default: null,
    length: 255,
  })
  first_name: string;

  @Column({
    type: 'varchar',
    nullable: true,
    default: null,
    length: 255,
  })
  last_name: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 255,
  })
  identity_number: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 255,
  })
  phone_number: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 255,
  })
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
