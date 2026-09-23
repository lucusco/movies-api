import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserNotFoundError } from './errors/user-not-found.error';
import { USERS_REPOSITORY } from './repositories/users-repository.interface';
import { EmailAlreadyInUseError } from './errors/email-already-in-use.error';

describe('UsersService', () => {
  let service: UsersService;
	let mockRepository: {
		create: jest.Mock;
		findAll: jest.Mock;
		findById: jest.Mock;
		findByIdAndUpdate: jest.Mock;
		findByIdAndDelete: jest.Mock;
	};

  beforeEach(async () => {
		mockRepository = {
			create: jest.fn(),
			findAll: jest.fn(),
			findById: jest.fn(),
			findByIdAndUpdate: jest.fn(),
			findByIdAndDelete: jest.fn(),
		};
		
    const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: USERS_REPOSITORY,
					useValue: mockRepository,
				},
			],
		}).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

	describe('findOne', () => {
		it('should return a user when found', async () => {
			const fakeUser = { _id: '123', firstName: 'João' };
			mockRepository.findById.mockResolvedValue(fakeUser);

			const result = await service.findOne('123');

			expect(result).toEqual(fakeUser);
			expect(mockRepository.findById).toHaveBeenCalledWith('123');
		});

		it('should throw UserNotFoundError when user does not exist', async () => {
			mockRepository.findById.mockResolvedValue(null);

			await expect(service.findOne('123')).rejects.toThrow(UserNotFoundError);
		});
	})

	describe('create', () => {
		it('should create and return a user', async () => {
			const createUserDto = {
				firstName: 'João',
				lastName: 'Silva',
				email: 'joao@email.com',
				passwordHash: '123456',
				birthDate: '1990-06-26',
			};
			const fakeUser = { _id: '123', ...createUserDto };

			mockRepository.create.mockResolvedValue(fakeUser);

			const result = await service.create(createUserDto);

			expect(result).toEqual(fakeUser);
			expect(mockRepository.create).toHaveBeenCalledWith(createUserDto);
		});

		it('should propagate EmailAlreadyInUseError when repository throws it', async () => {
			const createUserDto = {
				firstName: 'João',
				lastName: 'Silva',
				email: 'joao@email.com',
				passwordHash: '123456',
				birthDate: '1990-06-26',
			};

			mockRepository.create.mockRejectedValue(new EmailAlreadyInUseError(createUserDto.email));

			await expect(service.create(createUserDto)).rejects.toThrow(EmailAlreadyInUseError);
		});
	});

	describe('findAll', () => {
		it('should return an array of users', async () => {
			const fakeUsers = [
				{ _id: '1', firstName: 'João' },
				{ _id: '2', firstName: 'Maria' },
			];

			mockRepository.findAll.mockResolvedValue(fakeUsers);

			const result = await service.findAll();

			expect(result).toEqual(fakeUsers);
		});
	});

	describe('update', () => {
		it('should update and return the user', async () => {
			const updateUserDto = { firstName: 'João Atualizado' };
			const fakeUser = { _id: '123', firstName: 'João Atualizado' };

			mockRepository.findByIdAndUpdate.mockResolvedValue(fakeUser);

			const result = await service.update('123', updateUserDto);

			expect(result).toEqual(fakeUser);
			expect(mockRepository.findByIdAndUpdate).toHaveBeenCalledWith('123', updateUserDto);
		});

		it('should throw UserNotFoundError when user does not exist', async () => {
			mockRepository.findByIdAndUpdate.mockResolvedValue(null);

			await expect(service.update('1000', {})).rejects.toThrow(UserNotFoundError);
		});
	});

	describe('remove', () => {
		it('should remove the user and return a success message', async () => {

			const createUserDto = {
				firstName: 'João',
				lastName: 'Silva',
				email: 'joao@email.com',
				passwordHash: '123456',
				birthDate: '1990-06-26',
			};
			const fakeUser = { _id: '123', ...createUserDto };

			mockRepository.findByIdAndDelete.mockResolvedValue(
				fakeUser
			);

			const result = await service.remove('123');

			expect(result).toEqual({ message: 'User deleted successfully' });
		});

		it('should throw UserNotFoundError when user does not exist', async () => {
			mockRepository.findByIdAndDelete.mockResolvedValue(null);

			await expect(service.remove('123')).rejects.toThrow(UserNotFoundError);
		});
	});


});
