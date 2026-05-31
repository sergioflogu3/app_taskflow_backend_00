import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany({
      include: {
        project: true,
        assignee: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findOne(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        assignee: { select: { id: true, name: true, email: true } },
        comments: { include: { author: { select: { id: true, name: true } } } },
      },
    });
  }

  async create(data: CreateTaskDto, authorId: string): Promise<Task> {
    return this.prisma.task.create({ data });
  }

  async update(id: string, data: UpdateTaskDto): Promise<Task> {
    return this.prisma.task.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Task> {
    return this.prisma.task.delete({ where: { id } });
  }
}