import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserNotFoundError } from './errors/user-not-found.error';
import { USERS_REPOSITORY } from './repositories/users-repository.interface';
import type { IUsersRepository } from './repositories/users-repository.interface';

@Injectable()
export class UsersService {
	constructor(@Inject(USERS_REPOSITORY) private userRepository: IUsersRepository) {}

	create(createUserDto: CreateUserDto) {
		return this.userRepository.create(createUserDto);
	}

	findAll() {
		return this.userRepository.findAll();
	}

	async findOne(id: string) {
		const user = await this.userRepository.findById(id);

		if (!user) {
			throw new UserNotFoundError(id);
		}

		return user;
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		const user = await this.userRepository.findByIdAndUpdate(id, updateUserDto);

		if (!user) {
			throw new UserNotFoundError(id);
		}

		return user;
	}

	async remove(id: string) {
		const deleted = await this.userRepository.findByIdAndDelete(id);

		if (!deleted) {
			throw new UserNotFoundError(id);
		}

		return { message: 'User deleted successfully' };
	}
}
