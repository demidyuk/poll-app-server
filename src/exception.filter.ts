import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { ConfigService } from './config/config.service';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private clientUrl: string;
  constructor(config: ConfigService) {
    this.clientUrl = config.clientUrl;
  }
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    if (exception instanceof HttpException) {
      this.handleHTTPException(exception, { response, request });
    } else {
      response.status(500).json({
        exception: `${exception.name}: ${exception.message}: ${
          exception.stack
        }`,
      });
    }
  }
  handleHTTPException(exception: HttpException, { response, request }) {
    const status = exception.getStatus();
    switch (status) {
      case 401:
        response.redirect(this.clientUrl + '/signin/error');
        break;
      default:
        response.status(status).json(
          Object.assign(exception.getResponse(), {
            timestamp: new Date().toISOString(),
          }),
        );
    }
  }
}
