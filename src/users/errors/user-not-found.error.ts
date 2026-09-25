export class UserNotFoundError extends Error {
	constructor() {
		super(`User with not found`);
		this.name = 'UserNotFoundError';
	}
}