import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { CarteleraResponse, Movie } from '../interfaces/carteleraResponse';
import { MovieResponse } from '../interfaces/movieResponse';
import { CreditsResponse, Cast } from '../interfaces/creditsResponse';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {

  private baseURL = 'https://api.themoviedb.org/3';
  private carteleraPage = 1;
  public cargando = false;

  constructor(private http: HttpClient) { }

  get params() {
    return {
      api_key: 'a02e9d58af30f75ad51124ced2a1c3dd',
      language: 'es-ES',
      page: this.carteleraPage.toString()
    }
  }

  resetCarteleraPage(): void {
    this.carteleraPage = 1;
  }

  getCartelera(): Observable<Movie[]> {

    if (this.cargando) {
      return of([]);
    }

    this.cargando = true;
    return this.http.get<CarteleraResponse>(`${this.baseURL}/movie/now_playing`, {
      params: this.params
    }).pipe(
      map( (resp) => resp.results),
      tap( () => {
        this.carteleraPage ++;
        this.cargando = false;
      })
    );
  }

  getPeliculaDetalle(id: string): Observable<MovieResponse>{
    return this.http.get<MovieResponse>(`${this.baseURL}/movie/${id}`, {
      params: this.params
    }).pipe(
      catchError(error => of(null))
    );
  }

  getCast(id: string): Observable<Cast[]>{
    return this.http.get<CreditsResponse>(`${this.baseURL}/movie/${id}/credits`, {
      params: this.params
    }).pipe(
      catchError(error => of(null)),
      map(resp => resp.cast)
    );
  }

  buscarPeliculas(texto: string): Observable<Movie[]>{

    const params = {...this.params, page: '1', query: texto};

    return this.http.get<CarteleraResponse>(`${this.baseURL}/search/movie`, {
      params
    }).pipe(
      map(resp => resp.results)
    );
  }
}
