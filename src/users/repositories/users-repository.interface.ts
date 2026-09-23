import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "../schemas/user.schema";

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

export interface IUsersRepository {
	
	create(createUserDto: CreateUserDto): Promise<User>;
	
	findAll(): Promise<User[]>;
	
	findById(id: string): Promise<User | null>;
	
	findByIdAndUpdate(id: string, updateUserDto: UpdateUserDto): Promise<User | null>;
	
	findByIdAndDelete(id: string): Promise<User | null>;
}
