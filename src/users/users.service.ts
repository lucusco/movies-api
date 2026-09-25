import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserNotFoundError } from './errors/user-not-found.error';
import { USERS_REPOSITORY } from './repositories/users-repository.interface';
import type { CreateUserData, IUsersRepository } from './repositories/users-repository.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

	constructor(@Inject(USERS_REPOSITORY) private userRepository: IUsersRepository) {}

	async create(createUserDto: CreateUserDto) {
		const {password, ...data } = createUserDto;
		const hashedPasswd = await bcrypt.hash(password, 10);
		
		const newUser: CreateUserData = {
			...data,
			passwordHash: hashedPasswd,
		};

		return this.userRepository.create(newUser);
	}

	findAll() {
		return this.userRepository.findAll();
	}

	async findOne(id: string) {
		const user = await this.userRepository.findById(id);

		if (!user) {
			throw new UserNotFoundError();
		}

		return user;
	}

	async findByEmail(email: string) {
		const user = await this.userRepository.findByEmail(email);

		if (!user) {
			throw new UserNotFoundError();
		}

		return user;
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		const user = await this.userRepository.findByIdAndUpdate(id, updateUserDto);

		if (!user) {
			throw new UserNotFoundError();
		}

		return user;
	}

	async remove(id: string) {
		const deleted = await this.userRepository.findByIdAndDelete(id);

		if (!deleted) {
			throw new UserNotFoundError();
		}

		return { message: 'User deleted successfully' };
	}
}
