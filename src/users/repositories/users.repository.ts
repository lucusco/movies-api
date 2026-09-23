import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../schemas/user.schema";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { IUsersRepository } from "./users-repository.interface";
import { EmailAlreadyInUseError } from "../errors/email-already-in-use.error";
import { MongoServerError } from 'mongodb';

@Injectable()
export class UsersRepository implements IUsersRepository {

	constructor(@InjectModel(User.name) private userModel: Model<User>) {}

	async create(createUserDto: CreateUserDto) {
		try {
			return await this.userModel.create(createUserDto);
		} catch (error: unknown) {
			if (error instanceof MongoServerError && error.code === 11000) {
				throw new EmailAlreadyInUseError(createUserDto.email);
			}

			throw error;
		}
	}

	async findAll() {
		return await this.userModel.find();
	}

	async findById(id: string) {
		return await this.userModel.findById(id);
	}

	async findByIdAndUpdate(id: string, updateUserDto: UpdateUserDto) {
		return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
			returnDocument: 'after',
		});
	}

	async findByIdAndDelete(id: string) {
		return await this.userModel.findByIdAndDelete(id);
	}
}