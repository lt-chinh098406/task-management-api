import { TaskStatus } from '@/common/enums/task';
import { User } from '@/modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export class Task {
  @ApiProperty({ example: 'id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  status: TaskStatus;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
