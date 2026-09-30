import { Injectable } from '@nestjs/common';
import { TmdbService } from '../tmdb.service';

@Injectable()
export class SearchMoviesUseCase {
  constructor(private tmdbService: TmdbService) {}

  async execute(query: string) {
    return this.tmdbService.searchMovies(query);
  }
}
