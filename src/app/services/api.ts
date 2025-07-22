import { Injectable, inject, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiResponse, Character } from '../models/character';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private readonly API_URL: string = 'https://rickandmortyapi.com/api/character';
  private readonly http = inject(HttpClient);

  private charactersSignal = signal<Character[]>([]);
  public readonly characters: Signal<Character[]> = this.charactersSignal;

  getCharacters(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.API_URL).pipe(
      tap((response) => {
        this.charactersSignal.set(response.results);
      })
    );
  }

  searchCharacters(name: string): Observable<ApiResponse> {
    if (!name || name.trim() === '') {
      return this.getCharacters();
    }
    const url = `${this.API_URL}?name=${encodeURIComponent(name)}`;
    return this.http.get<ApiResponse>(url).pipe(
      tap((response) => {
        this.charactersSignal.set(response.results);
      })
    );
  }
}
