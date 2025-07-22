import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { Character } from '../../models/character';

import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule   
  ],
  templateUrl: './character-list.html',
  styleUrls: ['./character-list.scss']
})
export class CharacterListComponent implements OnInit {
  // Inyectar el servicio Api
  private api = inject(Api);

  // Conectar la señal pública de personajes
  public characters = this.api.characters;

  // Propiedades para el estado de la UI
  public searchTerm: string = '';
  public loading: boolean = false;
  public errorMessage: string = '';

  // Señal computada para saber si hay personajes
  public hasCharacters = computed(() => this.characters().length > 0);

  ngOnInit(): void {
    this.loadInitialCharacters();
  }

  loadInitialCharacters(): void {
    this.loading = true;
    this.errorMessage = '';
    this.api.getCharacters()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        error: () => {
          this.errorMessage = 'Error al cargar los personajes.';
        }
      });
  }

  onSearch(): void {
    this.loading = true;
    this.errorMessage = '';
    this.api.searchCharacters(this.searchTerm)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        error: () => {
          this.errorMessage = 'No se encontraron personajes con ese término de búsqueda.';
        }
      });
  }

  onSearchKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}