import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { UserNotFoundError } from "../errors/user-not-found.error";
import { Response } from 'express';

@Catch(UserNotFoundError)
export class UserNotFoundFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {

		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		response.status(404).json({
			statusCode: 404,
			message: exception.message,
		});
	}
}