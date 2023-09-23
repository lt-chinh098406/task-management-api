import { PostgresErrorCode } from '@/common/enums/postgres-error-code';
import { TaskStatus } from '@/common/enums/task';
import { IPagination } from '@/common/interfaces/pagination';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/create-task.dto copy';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(task: CreateTaskDto, user: User): Promise<Task> {
    try {
      const newTask = this.taskRepository.create({
        ...task,
        status: TaskStatus.OPEN,
        user,
      });

      await this.taskRepository.save(newTask);

      return newTask;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('User with this email or username already exists', HttpStatus.BAD_REQUEST);
      }

      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(filter: GetTaskFilterDto, user: User): Promise<{ data: Task[]; pagination: IPagination }> {
    try {
      const { status, search, page, limit } = filter;

      const query = this.taskRepository.createQueryBuilder('task');

      query.where('task.userId = :userId', { userId: user.id });

      if (status) {
        query.where('task.status = :status', { status });
      }

      if (search) {
        query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
      }

      if (page && limit) {
        query.skip((page - 1) * limit);
        query.take(limit);
      }

      const totalCount = await query.getCount();
      const totalPages = Math.ceil(totalCount / limit);
      const tasks = await query.getMany();

      return {
        data: tasks,
        pagination: {
          page,
          pageSize: limit,
          totalCount,
          totalPages,
        },
      };
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('User with this email or username already exists', HttpStatus.BAD_REQUEST);
      }

      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
