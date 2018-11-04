import { Injectable, CanActivate } from '@nestjs/common';
import { ConfigService } from './config/config.service';

@Injectable()
export class DevGuard implements CanActivate {
  private isDev: boolean;
  constructor(config: ConfigService) {
    this.isDev = config.isDev;
  }

  canActivate(): boolean {
    return this.isDev;
  }
}
