import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TmdbService {
  constructor(private httpService: HttpService) {}

  async searchMovies(query: string) {
    const response = await firstValueFrom(
      this.httpService.get('/search/movie', { 
        params: { query }
      })
    );

    return response.data;
  }
}
