import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../schemas/user.schema";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { IUsersRepository } from "./users-repository.interface";

@Injectable()
export class UsersRepository implements IUsersRepository {

	constructor(@InjectModel(User.name) private userModel: Model<User>) {}

	async create(createUserDto: CreateUserDto) {
		return await this.userModel.create(createUserDto);
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