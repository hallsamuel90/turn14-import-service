import { Controller, Get } from 'routing-controllers';

/**
 * Health Check Controller.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
@Controller()
export class HealthController {
  /**
   * Standard health check.
   *
   * @returns {string} 200 up and running if successful
   */
  @Get('/health')
  gethealth(): string {
    return 'Up and Running!';
  }
}
