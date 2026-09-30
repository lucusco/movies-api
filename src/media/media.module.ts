import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TmdbService } from './tmdb.service';
import { MediaController } from './media.controller';
import { SearchMoviesUseCase } from './use-cases/search-movies.use-case';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.getOrThrow<string>('BASE_URL_TMDB'),
        headers: {
          Authorization: `Bearer ${configService.getOrThrow<string>('TOKEN_TMDB')}`,
        },
        timeout: 5000,
      }),
    }),
  ],
  providers: [TmdbService, SearchMoviesUseCase],
  controllers: [MediaController],
})
export class MediaModule {}
