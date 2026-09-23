import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersRepository } from './repositories/users.repository';
import { USERS_REPOSITORY } from './repositories/users-repository.interface';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: User.name,
				schema: UserSchema,
			},
		]),
	],
	controllers: [UsersController],
	providers: [
		UsersService,
		{
			provide: USERS_REPOSITORY,
			useClass: UsersRepository,
		},
	],
})
export class UsersModule {}
