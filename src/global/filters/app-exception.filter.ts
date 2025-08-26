import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';
import { BaseResponse } from 'src/global/dto/base-response.dto';

@Catch()
export class AppExceptionFilters implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';
    let errors: any = null;

    // Handle HTTP exceptions
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const responseData = exception.getResponse();
      if (typeof responseData === 'string') {
        message = responseData;
      } else if (typeof responseData === 'object' && responseData['message']) {
        message = Array.isArray(responseData['message'])
          ? responseData['message'].join(', ')
          : responseData['message'];
      }
    }
    // Handle database query errors
    else if (exception instanceof QueryFailedError) {
      httpStatus = HttpStatus.BAD_REQUEST;
      const driverError = exception.driverError;

      switch (driverError?.code) {
        case '23502': // Not-null constraint
          message = 'Validation failed';
          errors = {
            details: `${driverError.column} field is required`,
            field: driverError.column,
          };
          break;

        case '23505': // Unique constraint
          message = 'Duplicate value error';
          errors = {
            details: `${driverError.detail || 'Value already exists'}`,
            field: driverError.constraint?.split('_')[1],
          };
          break;

        case '23503': // Foreign key violation
          message = 'Reference error';
          errors = { details: 'Related record does not exist' };
          break;

        case '22P02': // Invalid text representation
          message = 'Invalid data format';
          errors = { details: 'Invalid data type provided' };
          break;

        case '42703': // Undefined column
          message = 'Unknown field';
          errors = {
            details: `Field '${driverError.column}' does not exist`,
            field: driverError.column,
          };
          break;

        case '23514': // Check constraint
          message = 'Validation failed';
          errors = { details: 'Value does not meet requirements' };
          break;

        default:
          message = 'Database operation failed';
          errors = { details: driverError?.message || exception.message };
      }
    }
    // Other unexpected errors
    else {
      message = exception.message || 'Internal server error';
    }

    // Log full error for debugging
    console.error(
      '**************************************************************',
    );
    console.error(`Exception caught: ${exception}`);
    console.error(
      '**************************************************************',
    );

    // Build BaseResponse
    const baseResponse: BaseResponse<null> = {
      status: 'error',
      message,
      data: null,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    httpAdapter.reply(response, baseResponse, httpStatus);
  }
}
