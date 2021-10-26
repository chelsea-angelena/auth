import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  email: string;
  password: string;
  currentHashedRefreshToken?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
