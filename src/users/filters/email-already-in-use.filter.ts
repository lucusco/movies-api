import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from 'express';
import { EmailAlreadyInUseError } from "../errors/email-already-in-use.error";

@Catch(EmailAlreadyInUseError)
export class EmailAlreadyInUseFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		response.status(409).json({
			statusCode: 409,
			message: exception.message,
		});
	}
}