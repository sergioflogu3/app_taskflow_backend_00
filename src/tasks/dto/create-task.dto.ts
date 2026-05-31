import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  MinLength,
  MaxLength,
  IsDateString,
} from 'class-validator';
import { TaskStatus, Priority } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
  @MaxLength(200, { message: 'El título no puede exceder 200 caracteres' })
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TaskStatus, { message: 'Estado inválido' })
  status?: TaskStatus;

  @IsEnum(Priority, { message: 'Prioridad inválida' })
  priority?: Priority;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe ser un formato válido ISO 8601' })
  dueDate?: string;

  @IsUUID('4', { message: 'El projectId debe ser un UUID válido' })
  projectId: string;

  @IsOptional()
  @IsUUID('4', { message: 'El assigneeId debe ser un UUID válido' })
  assigneeId?: string;
}