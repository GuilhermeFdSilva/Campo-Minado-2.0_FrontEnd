import { LocalStorageService } from './data-classes/local-storage/local-storage.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Board } from './game-classes/board/board';
import { GameDecoderService } from './game-classes/game-decoder.service';

@Injectable({
  providedIn: 'root'
})
export class GameManagerService {
  private activeDate: Date = new Date();
  private gameLoaded: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private storageService: LocalStorageService) { }

  get getActiveDate(): Date {
    return this.activeDate;
  }

  public addActiveDate(days: number, months?: number): void {
    if (months) {
      this.activeDate.setMonth(this.activeDate.getMonth() + months);
    }

    this.activeDate.setDate(this.activeDate.getDate() + days);

    this.getGame();
  }

  public subtractActiveDate(days: number, months?: number): void {
    if (months) {
      this.addActiveDate(-days, -months);
    } else {
      this.addActiveDate(-days);
    }
  }

  get getGameLoaded(): Observable<Board> {
    return this.gameLoaded.asObservable();
  }

  public saveGame(board: Board): void {
    const game = GameDecoderService.encodeGame(board);

    this.storageService.saveGame(game[0], game[1]);
  }

  private getGame(): void {
    const game = this.storageService.getGameByDate(this.activeDate);

    if (game) {
      this.gameLoaded.next(GameDecoderService.decodeSavedGame(game[0], game[1]));
    } else {
      this.gameLoaded.next(GameDecoderService.decodeNewGame("2024-07-09.9915293255717586879496"));
    }
  }

  public start(): void {
    if (!this.gameLoaded.getValue()) {
      this.getGame();
    }
  }
}
