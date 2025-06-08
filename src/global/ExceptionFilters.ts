import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';

interface ErrorResponse {
  status: 'error';
  message: string;
  details?: string; // For user-friendly details
  field?: string; // Affected field if available
  timestamp: number;
  path: string;
}

@Catch()
export class ApplicationExceptionFilters implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Default error response
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const errorResponse: ErrorResponse = {
      status: 'error',
      message: 'An unexpected error occurred',
      timestamp: Date.now(),
      path: request.url,
    };

    // Handle HTTP exceptions
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      errorResponse.message = exception.message;
    }
    // Handle database query errors
    else if (exception instanceof QueryFailedError) {
      httpStatus = HttpStatus.BAD_REQUEST;
      const driverError = exception.driverError;

      // Handle specific PostgreSQL error codes
      switch (driverError?.code) {
        case '23502': // Not-null constraint
          errorResponse.message = 'Validation failed';
          errorResponse.details = `${driverError.column} field is required`;
          errorResponse.field = driverError.column;
          break;

        case '23505': // Unique constraint
          errorResponse.message = 'Duplicate value error';
          errorResponse.details = `${driverError.detail || 'Value already exists'}`;
          // Extract field name from constraint if possible
          if (driverError.constraint?.includes('_')) {
            const field = driverError.constraint.split('_')[1];
            if (field) errorResponse.field = field;
          }
          break;

        case '23503': // Foreign key violation
          errorResponse.message = 'Reference error';
          errorResponse.details = 'Related record does not exist';
          break;

        case '22P02': // Invalid text representation
          errorResponse.message = 'Invalid data format';
          errorResponse.details = 'Invalid data type provided';
          break;

        case '42703': // Undefined column
          errorResponse.message = 'Unknown field';
          errorResponse.details = `Field '${driverError.column}' does not exist`;
          errorResponse.field = driverError.column;
          break;

        case '23514': // Check constraint
          errorResponse.message = 'Validation failed';
          errorResponse.details = 'Value does not meet requirements';
          break;

        default:
          errorResponse.message = 'Database operation failed';
          errorResponse.details = driverError?.message || exception.message;
      }
    }
    // Handle other unexpected errors
    else {
      errorResponse.message = exception.message || 'Internal server error';
    }

    // Log detailed error for developers
    console.log(
      '**************************************************************',
    );
    console.log(
      'This is a log of exception object {} from global catch filter !',
    );
    console.log(
      '**************************************************************',
    );
    console.error(`Exception caught in ApplicationExceptionFilters:
      Path: ${request.url}
      Method: ${request.method}`);
    console.log(
      '**************************************************************',
    );
    console.log(exception);
    console.log(
      '**************************************************************',
    );

    httpAdapter.reply(response, errorResponse, httpStatus);
  }
}
