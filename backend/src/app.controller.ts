import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'Home-X Construction Inventory API',
      phase: 'Phase 1 foundation',
    };
  }
}
