import { Controller, Get } from 'routing-controllers';

/**
 *
 */
@Controller()
export class HealthController {
  @Get('/health')
  gethealth(): string {
    return 'Up and Running!';
  }
}
