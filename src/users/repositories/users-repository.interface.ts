import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserDocument } from "../schemas/user.schema";

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

export type CreateUserData = Omit<CreateUserDto, 'password'> & {
	passwordHash: string;
};

export interface IUsersRepository {
  create(createUserData: CreateUserData): Promise<UserDocument>;

  findAll(): Promise<UserDocument[]>;

  findById(id: string): Promise<UserDocument | null>;

  findByEmail(email: string): Promise<UserDocument | null>;

  findByIdAndUpdate(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument | null>;

  findByIdAndDelete(id: string): Promise<UserDocument | null>;
}
