import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private termsReadKey: string = "storageTermsRead";

  constructor() { }

  public hasReadTerms (): boolean {
    if (localStorage.getItem(this.termsReadKey)) {
      return true;
    } else {
      return false;
    }
  }

  public acceptStorageTerms(): void {
    localStorage.setItem(this.termsReadKey, 'true');
  }

  public getGameByDate(date: Date): Array<string> | null {
    const key = this.formatDate(date);
    const game = localStorage.getItem(key);

    if (game) {
      return [key, game];
    } else {
      return null;
    }
  }

  public saveGame(key: string, game: string): void {
    localStorage.setItem(key, game);
  }
  
  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  // TODO: Remove
  public clear(): void {
    localStorage.clear();
  }
}
