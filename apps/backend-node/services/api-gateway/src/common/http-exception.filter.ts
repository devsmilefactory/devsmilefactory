import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from './logger.service';

interface ErrorBody {
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
  message: string | string[];
  requestId?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse: ErrorBody = {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      statusCode: status,
      message:
        typeof message === 'string'
          ? message
          : (message as { message?: string | string[] }).message ??
            'Unexpected error',
      requestId: request.headers['x-request-id'] as string | undefined,
    };

    this.logger.error(
      JSON.stringify(errorResponse),
      exception instanceof Error ? exception.stack : undefined,
      'HttpExceptionFilter',
    );
    response.status(status).json(errorResponse);
  }
}
