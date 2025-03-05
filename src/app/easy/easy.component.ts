import { Board, Status } from '../../assets/services/game-classes/board/board';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Field } from 'src/assets/services/game-classes/field/field';
import { GameManagerService } from 'src/assets/services/game-manager.service';

@Component({
  selector: 'app-easy',
  templateUrl: './easy.component.html',
  styleUrls: ['./easy.component.scss']
})
export class EasyComponent implements OnInit {
  public board: Board;
  public seconds: number = 0;

  private timer: any;

  constructor(private gameManager: GameManagerService, private element: ElementRef) {
    window.addEventListener('beforeunload', (event) => {
      // this.board.setSeconds(this.seconds);
      // gameManager.saveGame(this.board);
    });
  }

  ngOnInit(): void {
    this.gameManager.getGameLoaded.subscribe(board => {
      this.board = board;

      if (board) {
        this.seconds = board.getSeconds;

        this.board.getObservableStatus.subscribe(status => {
          if (status == Status.VICTORY) {
            this.victory();
          } else if (status == Status.DEFEAT) {
            this.defeat();
          }
        });
      }
    });

    this.gameManager.start();
  }

  public openField(row: number, column: number): void {
    if (this.board.getStatus == Status.NEW) {
      if (!this.timer) {
        this.timer = setInterval(() => {
          this.seconds++;
        }, 1000);
      }

      this.board.openField(row, column);
    }
  }

  public toggleFlaged(event: Event, field: Field): void {
    if (this.board.getStatus == Status.NEW) {
      event.preventDefault();
      this.board.toggleFlaggedField(field.getRow, field.getColumn);
    }
  }

  public containerButtonClass(field: Field): string {
    if (field.isOpen) {
      if (field.isMined) {
        if (field.isTarget) {
          return "mined-button-container";
        } else {
          return "open-button-container";
        }
      } else {
        return "open-button-container";
      }
    } else {
      if (this.board.getStatus == Status.NEW) {
        return "close-button-container active-button-container";
      } else {
        return "close-button-container";
      }
    }
  }

  public buttonClass(field: Field): string {
    if (field.isOpen) {
      if (field.isMined) {
        if (field.isTarget) {
          return "mined-button";
        } else {
          return "open-button";
        }
      } else {
        return "open-button";
      }
    } else {
      if (this.board.getStatus == Status.NEW) {
        return "close-button active-button"
      } else {
        return "close-button"
      }
    }
  }

  public spanColor(field: Field): string {
    let minesAround = Number(field.minesAround())

    switch (minesAround) {
      case 1: return "var(--one-bomb)";
      case 2: return "var(--two-bombs)";
      case 3: return "var(--three-bombs)";
      case 4: return "var(--four-bombs)";
      case 5: return "var(--five-bombs)";
      case 6: return "var(--six-bombs)";
      case 7: return "var(--seven-bombs)";
      case 8: return "var(--eight-bombs)";
      default: return "";
    }
  }

  public getMinutes(): string {
    return Math.floor(this.seconds / 60).toString();
  }

  public getSeconds(): string {
    let seconds = this.seconds % 60;

    return seconds.toString().padStart(2, "0");
  }

  public getGameStatus(): string {
    if (this.board.getStatus == Status.VICTORY) {
      return "VITÓRIA!"
    } else if (this.board.getStatus == Status.DEFEAT) {
      return "GAME OVER! 💥"
    } else {
      return "";
    }
  }

  private victory(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.board.setSeconds(this.seconds);
    this.gameManager.saveGame(this.board);

    this.blockBoard();
  }

  private defeat(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.board.setSeconds(this.seconds);
    this.gameManager.saveGame(this.board);

    this.blockBoard();
  }

  private blockBoard(): void {
    const buttonsContainers = this.element.nativeElement.querySelectorAll(".button-container");

    if (buttonsContainers) {
      buttonsContainers.forEach((e: HTMLDivElement) => {
        e.classList.remove("active-button-container");

        let b: HTMLButtonElement | null = e.querySelector(".button");

        if (b) {
          b.disabled = true;
          b.classList.remove("active-button");
        }
      });
    }
  }
}
