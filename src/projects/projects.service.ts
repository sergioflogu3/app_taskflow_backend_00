import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Project } from '@prisma/client';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return projects as Project[];
  }

  async findOne(id: string): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        tasks: true,
        members: true,
      },
    });
    return project as Project | null;
  }

  async create(data: CreateProjectDto): Promise<Project> {
    return this.prisma.project.create({
      data,
    });
  }

  async update(id: string, data: UpdateProjectDto): Promise<Project> {
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Project> {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}