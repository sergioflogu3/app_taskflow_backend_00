import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Module({
  imports: [PrismaModule],
  controllers: [TasksController],
  providers: [TasksService, JwtAuthGuard],
  exports: [TasksService],
})
export class TasksModule {}