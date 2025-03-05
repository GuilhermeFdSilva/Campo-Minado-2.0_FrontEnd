import { Observable, Subject } from "rxjs";

export class Field {
  private mined: boolean = false;
  private target: boolean = false;
  private flagged: boolean = false;
  private open: boolean = false;
  private adjacentFields: Array<Field> = [];

  private static changeObservable: Subject<void> = new Subject();

  constructor(private row: number, private column: number) { }

  get getRow(): number {
    return this.row;
  }

  get getColumn(): number {
    return this.column;
  }

  get isMined(): boolean {
    return this.mined;
  }

  get isTarget(): boolean {
    return this.target;
  }

  get isFlagged(): boolean {
    return this.flagged;
  }

  get isOpen(): boolean {
    return this.open;
  }

  public markAsMined(): void {
    this.mined = true;
  }

  public toggleFlagged(): void {
    if (!this.isOpen) {
      this.flagged = !this.flagged;
    }
  }

  public openField(target?: boolean): void {
    target || this.target ? this.target = true : null;

    if (this.flagged || this.open) {
      return;
    } else if (this.mined) {
      this.open = true;
      throw new DefeatError();
    }

    this.open = true;
    Field.changeObservable.next();

    if (this.isadjacentFieldsSafe()) {
      setTimeout(() => this.adjacentFields.forEach(field => field.openField()), 80);
    }
  }

  public openAlone(target?: boolean): void {
    target || this.target ? this.target = true : null;
    this.open = true;    
  }

  public minesAround(): string {
    if (this.mined) {
      return "";
    }

    let counter = 0;

    this.adjacentFields.forEach(f => { if (f.isMined) counter++ });

    if (counter == 0) {
      return "";
    } else {
      return counter.toString();
    }
  }

  public setAdjacentFields(field: Field): void {
    const rowDistance = Math.abs(field.getRow - this.row);
    const columnDistance = Math.abs(field.getColumn - this.column);

    if (rowDistance == 0 && columnDistance == 1) {
      this.adjacentFields.push(field);
    } else if (rowDistance == 1 && columnDistance == 0) {
      this.adjacentFields.push(field);
    } else if (rowDistance == 1 && columnDistance == 1) {
      this.adjacentFields.push(field);
    }
  }

  public isSolved(): boolean {
    if ((this.open && !this.mined) || (!this.open && this.mined)) {
      return true;
    } else {
      return false;
    }
  }

  public static getFildsChangeObservable(): Observable<void> {
    return this.changeObservable.asObservable();
  }

  private isadjacentFieldsSafe(): boolean {
    return this.adjacentFields.every(f => !f.mined);
  }
}

export class Mine {
  constructor(private row:number, private column: number) { }

  get getRow(): number {
    return this.row;
  }

  get getColumn(): number {
    return this.column;
  }
}

export class DefeatError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, DefeatError.prototype);
    this.name = "DefeatError";
  }
}
