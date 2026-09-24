import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
	let mockUsersService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
		mockUsersService = {
			create: jest.fn(),
			findAll: jest.fn(),
			findOne: jest.fn(),
			update: jest.fn(),
			remove: jest.fn(),
		};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
				{
					provide: UsersService,
					useValue: mockUsersService,
				}
			],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

	describe('findOne', () => {
		it('should call usersService.findOne with the correct id and return the result', async () => {
			const fakeUser = { _id: '123', firstName: 'João' };
			mockUsersService.findOne.mockResolvedValue(fakeUser);

			const result = await controller.findOne('123');

			expect(result).toEqual(fakeUser);
			expect(mockUsersService.findOne).toHaveBeenCalledWith('123');
		});
	});

	describe('findAll', () => {
		it('should call usersService.findAll and return an array of users', async () => {
			const fakeUsers = [
				{ _id: '123', firstName: 'João' },
				{ _id: '456', firstName: 'Maria' },
			];

			mockUsersService.findAll.mockResolvedValue(fakeUsers);
			const result = await controller.findAll();

			expect(result).toEqual(fakeUsers);
			expect(mockUsersService.findAll).toHaveBeenCalled();
		});
	});

	describe('update', () => {
		it('should call usersService.update and return the result', async () => {
			const fakeUser = {
				_id: '12',
				firstName: 'João',
				lastName: 'Silva',
				email: 'joao@email.com',
				passwordHash: '123456',
				birthDate: '1990-06-26',
			};
			let updateUserDto = { lastName: 'Bueno' };

			mockUsersService.update.mockResolvedValue(fakeUser);
			const result = await controller.update('12', updateUserDto);

			expect(result).toEqual(fakeUser);
			expect(mockUsersService.update).toHaveBeenCalledWith('12', updateUserDto);
		});
	});

	describe('remove', () => {
		it('should call usersService.remove and return the result', async () => {
			let expected = { message: 'User deleted successfully' };

			mockUsersService.remove.mockResolvedValue(expected);
			const result = await controller.remove('12');

			expect(result).toEqual(expected);
			expect(mockUsersService.remove).toHaveBeenCalledWith('12');
		});
	});

	describe('create', () => {
		it('should call usersService.create and return the result', async () => {
			const fakeUser = {
				_id: '124',
				firstName: 'João',
				lastName: 'Silva',
				email: 'joao@email.com',
				passwordHash: '123456',
				birthDate: '1990-06-26',
			};
			let createUserDto = {
				firstName: 'João',
				lastName: 'Silva',
				email: 'joao@email.com',
				passwordHash: '123456',
				birthDate: '1990-06-26',
			};

			mockUsersService.create.mockResolvedValue(fakeUser);
			const result = await controller.create(createUserDto);

			expect(result).toEqual(fakeUser);
			expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
		});
	});

});
