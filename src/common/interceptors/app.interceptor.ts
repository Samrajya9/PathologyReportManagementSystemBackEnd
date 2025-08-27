import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, throwError } from 'rxjs';
import { BaseResponse } from '@common/dto/base-response.dto';
import { Reflector } from '@nestjs/core';
import { RESPONSE_MESSAGE_KEY } from '@common/decorators/response-message.decorator';

@Injectable()
export class AppInterceptors implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const logger = new Logger('AppInterceptors');
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    // Get request metadata
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;
    const method = request.method;
    const requestBody = this.sanitizeBody(request.body);
    const files = request.files || request.file;
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip || request.connection?.remoteAddress;
    const endpoint = context.getHandler()['path'] || request.route?.path;
    const userTypedEndpoint = request.originalUrl; // Full URL with query params

    const logMessage = [
      '',
      `Incoming Request----------`,
      `userTypedEndpoint: ${userTypedEndpoint}`, // Added endpoint here
      `Endpoint: ${endpoint}`, // Added endpoint here
      `Class: ${className}`,
      `Handler: ${handlerName}`,
      `Method: ${method}`,
      `IP: ${ip}`,
      `User-Agent: ${userAgent}`,
      `Body: ${JSON.stringify(requestBody)}`,
      `Files: ${JSON.stringify(this.sanitizeFiles(files))}`,
      ``,
    ].join('\n');

    logger.verbose(logMessage);

    // Intercept the request here
    return next.handle().pipe(
      map((result) => {
        const message =
          this.reflector.get<string>(
            RESPONSE_MESSAGE_KEY,
            context.getHandler(),
          ) || 'Request processed successfully';
        const baseResponse: BaseResponse<typeof result> = {
          status: 'success',
          message,
          data: result,
          errors: null, // add this
          timestamp: new Date().toISOString(),
          path: request.url,
        };
        return baseResponse;
      }),
      // Log the response
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  private sanitizeBody(body: any): any {
    // Remove sensitive information from logs
    if (!body) return body;

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'creditCard', 'ssn'];

    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });
    return sanitized;
  }

  private sanitizeFiles(files: any): any {
    if (!files) return files;

    if (Array.isArray(files)) {
      return files.map((file) => ({
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      }));
    }

    return {
      originalname: files.originalname,
      mimetype: files.mimetype,
      size: files.size,
    };
  }
}
