import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UserNotFoundFilter } from './users/filters/user-not-found.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(new ValidationPipe({}));
	app.useGlobalFilters(new UserNotFoundFilter());
	
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
