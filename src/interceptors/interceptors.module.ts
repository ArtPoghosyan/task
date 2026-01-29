import { Module } from '@nestjs/common';
import { ErrorLoggingInterceptor } from './interceptors.errorLogging';

@Module({
  providers: [ErrorLoggingInterceptor],
  exports: [ErrorLoggingInterceptor],
})
export class InterceptorsModule {}
