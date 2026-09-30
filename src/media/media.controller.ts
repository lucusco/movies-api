import { Controller, Get, Query } from '@nestjs/common';
import { SearchMoviesUseCase } from './use-cases/search-movies.use-case';

@Controller('media')
export class MediaController {
  constructor(private searchMoviesUseCase: SearchMoviesUseCase) {}

  @Get('search')
  async searchMovies(@Query('query') query: string) {
    return this.searchMoviesUseCase.execute(query);
  }
}
