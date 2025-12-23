/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsBoolean } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  name: string;

  @IsBoolean()
  completed: boolean;
}
