import { ExceptionFilter, Catch, ArgumentsHost,
    HttpStatus } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
const ctx = host.switchToHttp();
const response = ctx.getResponse<Response>();

switch (exception.code) {
 case 'P2002':
   return response.status(HttpStatus.CONFLICT).json({
     statusCode: 409,
     message: 'Recurso duplicado',
   });
 case 'P2025':
   return response.status(HttpStatus.NOT_FOUND).json({
     statusCode: 404,
     message: 'Recurso no encontrado',
   });
 default:
   return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
     statusCode: 500,
     message: 'Error de base de datos',
   });
}
}
}
