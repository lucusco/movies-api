import {
	IsString,
	IsNotEmpty,
	IsEmail,
	IsDateString,
	IsOptional,
	MinLength,
	IsUrl
} from 'class-validator';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	firstName: string;

	@IsString()
	@IsNotEmpty()
	lastName: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	password: string;

	@IsDateString()
	@IsNotEmpty()
	birthDate: string;

	@IsString()
	@IsOptional()
	@IsUrl()
	avatarUrl?: string;
}
