import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot(): object {
    return {message: "Taskflow API funcionando ", version: "1.0.0"}
  }

  @Get('health')
  getHealth(): object {
    return {
      status: "ok",
      database: "Conectada (Simulacion)",
      timestamp: new Date().toISOString(),
    }
  }
}
