import { IsBoolean, IsDateString, IsOptional, IsString, MinLength } from "class-validator";

export class CreateTodoDto {
  @IsString()
  @MinLength(1, { message: '일정을 입력해주세요.' })
  todo: string = "";

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean = false;
}

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  todo!: string;

  @IsOptional()
  @IsBoolean()
  isCompleted!: boolean;

  @IsOptional()
  @IsDateString()
  updatedAt!: string;
}
