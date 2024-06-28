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

  // TODO: Remove
  public clear(): void {
    localStorage.clear();
  }
}
