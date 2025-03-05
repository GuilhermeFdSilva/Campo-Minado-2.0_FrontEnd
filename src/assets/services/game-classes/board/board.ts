import { BehaviorSubject, Observable } from "rxjs";
import { Field, Mine } from "../field/field";

export class Board {
  private minesNum: number = 0;
  private fields: Array<Field> = [];
  private seconds: number;

  private observableStatus: BehaviorSubject<Status> = new BehaviorSubject(this.status);

  constructor(private date: Date, private rows: number, private columns: number, private mines: Array<Mine>, private status: Status, seconds?: number) {
    this.minesNum = this.mines.length;
    this.seconds = seconds ?? 0;

    this.generateFields();
    this.setAdjacentFields();
    this.plantMines();

    Field.getFildsChangeObservable().subscribe(() => {
      if (this.fields.every(f => f.isSolved())) {
        this.victory();
      }
    });
  }

  public static loadBoard(date: Date, rows: number, columns: number, fields: Array<Field>, status: Status, seconds: number): Board {
    const mines = new Array<Mine>();

    for (let field of fields) {
      if (field.isMined) {
        let mine = new Mine(field.getRow, field.getColumn);
        
        mines.push(mine);
      }
    }
    
    const board = new Board(date, rows, columns, mines, status, seconds);

    board.fields = fields;
    board.setAdjacentFields();

    return board;
  }

  get getDate(): Date {
    return this.date;
  }

  get getRows(): number {
    return this.rows;
  }

  get getColumns(): number {
    return this.columns;
  }

  get getMinesNum(): number {
    return this.minesNum;
  }

  get getFields(): Array<Field> {
    return this.fields;
  }

  get getObservableStatus(): Observable<Status> {
    return this.observableStatus.asObservable();
  }

  get getStatus(): Status {
    return this.status;
  }

  get getSeconds(): number {
    return this.seconds;
  }

  public setSeconds(seconds: number) {
    this.seconds = seconds;
  }

  public openField(row: number, column: number): void {
    try {
      let field = this.fields.find(f => f.getRow == row && f.getColumn == column);
      
      if (field) {
        field.isMined ? field.openField(true) : field.openField();
      }

    } catch (DefeatError) {
      this.defeat();
    }
  }

  public toggleFlaggedField(row: number, column: number): void {
    this.fields.find(f => f.getRow == row && f.getColumn == column)?.toggleFlagged();
  }

  public bombCounter(): number {
    let activeBombs = this.minesNum;

    this.fields.forEach(f => { if (f.isFlagged) activeBombs-- });

    return activeBombs >= 0 ? activeBombs : 0;
  }

  private victory(): void {
    this.status = Status.VICTORY;
    this.observableStatus.next(this.status);
    this.flaggeMines();
  }

  private defeat(): void {
    this.status = Status.DEFEAT;
    this.observableStatus.next(this.status);
    this.revealMines();
  }

  private revealMines(): void {
    this.fields.forEach(f => f.isFlagged ? f.toggleFlagged() : null);

    const tempMines = [...this.mines];

    const revealNextMine = () => {
      if (tempMines.length == 0) {
        return;
      }

      const randomMine = Math.floor(Math.random() * tempMines.length);
      const mine = tempMines.splice(randomMine, 1)[0];

      try {
        this.fields.find(f => f.getRow == mine.getRow && f.getColumn == mine.getColumn)
          ?.openField();
      } catch (DefeatError) { }
      setTimeout(revealNextMine, 300);
    };

    revealNextMine();
  }

  private flaggeMines(): void {
    this.fields.forEach(f => {
      if (f.isMined && !f.isFlagged) {
        f.toggleFlagged();
      }
    });
  }

  private generateFields(): void {
    for (let r = 1; r <= this.rows; r++) {
      for (let c = 1; c <= this.columns; c++) {
        this.fields.push(new Field(r, c));
      }
    }
  }

  private setAdjacentFields(): void {
    for (let f1 of this.fields) {
      for (let f2 of this.fields) {
        f1.setAdjacentFields(f2);
      }
    }
  }

  private plantMines(): void {
    if (this.minesNum == 0) {
      throw new GameError("Internal server error.");
    }

    for (let mine of this.mines) {
      this.fields.find(
        f =>
          f.getRow == mine.getRow &&
          f.getColumn == mine.getColumn
      )?.markAsMined();
    }
  }
}

export class GameError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, GameError.prototype);
    this.name = "GameError";
  }
}

export enum Status {
  NEW,
  VICTORY,
  DEFEAT
}
