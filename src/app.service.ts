import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { HealthCheck: string } {
    return { HealthCheck: 'OK' };
  }
}
