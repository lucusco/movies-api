import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from '../schemas/user.schema';
import { UpdateUserDto } from "../dto/update-user.dto";
import { CreateUserData, IUsersRepository } from "./users-repository.interface";
import { EmailAlreadyInUseError } from "../errors/email-already-in-use.error";
import { MongoServerError } from 'mongodb';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserData: CreateUserData) {
    try {
      return await this.userModel.create(createUserData);
    } catch (error: unknown) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new EmailAlreadyInUseError(createUserData.email);
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

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email });
  }

  async findByIdAndUpdate(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument | null> {
    return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      returnDocument: 'after',
    });
  }

  async findByIdAndDelete(id: string): Promise<UserDocument | null> {
    return await this.userModel.findByIdAndDelete(id);
  }
}