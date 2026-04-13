import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      service: 'annebeala-spa-api',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
