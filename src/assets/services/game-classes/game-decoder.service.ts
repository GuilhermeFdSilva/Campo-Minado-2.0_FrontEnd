import { Board, Status } from "./board/board";
import { Field, Mine } from './field/field';

export class GameDecoderService {
  private static hash: string;

  public static decodeNewGame(hash: string): Board {
    this.hash = hash;

    const date = this.extractDate();
    const rows = this.extractSingle();
    const columns = this.extractSingle();
    const mines = this.extractMines();

    return new Board(date, rows, columns, mines, Status.NEW);
  }

  public static decodeSavedGame(key: string, hash: string): Board {
    this.hash = hash;

    const rows = this.extractSingle();
    const columns = this.extractSingle();
    const status = this.extractStatus();
    const seconds = this.extractDouble();
    const fields = this.extractFields(rows, columns);

    return Board.loadBoard(this.keyToDate(key), rows, columns, fields, status, seconds);
  }

  public static encodeGame(board: Board): Array<string> {
    let gameKey = this.formatDate(board.getDate).replace(".", "");
    let gameHash = "";

    gameHash += this.formatSingle(board.getRows);
    gameHash += this.formatSingle(board.getColumns);
    gameHash += this.formatStatus(board.getStatus);
    gameHash += this.formatDouble(board.getSeconds);

    board.getFields.forEach(f => gameHash += this.formatField(f));

    return new Array<string>(gameKey, gameHash);
  }

  private static extractDate(): Date {
    const dateString = this.hash.split(".")[0];
    this.hash = this.hash.split(".")[1];

    return new Date(dateString + "T12:00:00Z");
  }

  private static formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  private static keyToDate(key: string): Date {
    return new Date(key + "T12:00:00Z");
  }

  private static extractSingle(): number {
    let value = this.hash.charCodeAt(0);
    this.hash = this.hash.substring(1);

    if (value > 47 && value < 58) {
      return value - 48;
    } else if (value > 96 && value < 123) {
      return value - 87;
    } else {
      throw new HashError("Internal server error.");
    }
  }

  private static formatSingle(value: number): string {
    if (value < 10) {
      return value.toString();
    } else if (value >= 10 && value < 36) {
      return String.fromCharCode(value + 87);
    } else {
      throw new HashError("Internal server error.");
    }
  }

  private static extractDouble(): number {
    const n1 = this.hash.charCodeAt(0);
    const n2 = this.hash.charCodeAt(1);
    this.hash = this.hash.substring(2);

    let numValue = 0;

    if (n1 > 47 && n1 < 58) {
      numValue += (n1 - 48) * 36;
    } else if (n1 > 96 && n1 < 123) {
      numValue += (n1 - 87) * 36;
    }

    if (n2 > 47 && n2 < 58) {
      numValue += (n2 - 48);
    } else if (n2 > 96 && n2 < 123) {
      numValue += (n2 - 87);
    }

    return numValue;
  }

  private static formatDouble(value: number): string {
    if (value < 36) {
      return this.formatSingle(value).padStart(2, "0");
    } else {
      let top = 0;

      while (value >= 36) {
        top++;
        value -= 36;
      }

      return (this.formatSingle(top) + this.formatSingle(value));
    }
  }

  private static extractMines(): Array<Mine> {
    const mines = new Array<Mine>();

    while (this.hash.length > 0) {
      let mine = new Mine(this.extractSingle(), this.extractSingle());

      mines.push(mine);
    }

    return mines;
  }

  private static extractStatus(): Status {
    const status = this.hash.charAt(0);
    this.hash = this.hash.substring(1);

    switch (status) {
      case "n": return Status.NEW;
      case "v": return Status.VICTORY;
      case "d": return Status.DEFEAT;
      default: throw new HashError("Internal server error.");
    }
  }

  private static formatStatus(status: Status): string {
    switch (status) {
      case Status.NEW: return "n";
      case Status.VICTORY: return "v";
      case Status.DEFEAT: return "d";
    }
  }

  private static extractFields(rows: number, columns: number): Array<Field> {
    let fields = new Array<Field>();

    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= columns; c++) {
        const field = this.extractField(r, c);
        fields.push(field);
      }
    }

    return fields;
  }

  private static extractField(row: number, column: number): Field {
    const fieldStatus = this.hash.charAt(0);
    this.hash = this.hash.substring(1);

    const field = new Field(row, column);

    if (fieldStatus == "a") {
      field.markAsMined();
      field.toggleFlagged();
    } else if (fieldStatus == "m") {
      field.markAsMined();
    } else if (fieldStatus == "x") {
      field.openAlone(true);
      field.markAsMined();
    } else if (fieldStatus == "0") {
      field.openAlone();
      field.markAsMined();
    } else if (fieldStatus == "o") {
      field.openAlone();
    } else if (fieldStatus == "f") {
      field.toggleFlagged();
    }

    return field;
  }

  private static formatField(field: Field): string {
    let fieldStatus = "";

    if (field.isMined) {
      if (field.isSolved()) {
        if (field.isFlagged) {
          fieldStatus = "a"
        } else {
          fieldStatus = "m";
        }
      } else {
        if (field.isTarget) {
          fieldStatus = "x";
        } else {
          fieldStatus = "0";
        }
      }
    } else if (field.isOpen) {
      fieldStatus = "o";
    } else if (field.isFlagged) {
      fieldStatus = "f";
    } else {
      fieldStatus = "u"
    }

    return fieldStatus;
  }
}

export class HashError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, HashError.prototype);
    this.name = "HashError";
  }
}
