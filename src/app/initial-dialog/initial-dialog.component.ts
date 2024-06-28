import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LocalStorageService } from 'src/assets/services/data-classes/local-storage/local-storage.service';

@Component({
  selector: 'app-initial-dialog',
  templateUrl: './initial-dialog.component.html',
  styleUrls: ['./initial-dialog.component.scss']
})
export class InitialDialogComponent implements OnInit{
  public checked: boolean = false;

  constructor(public dialogRef: MatDialogRef<InitialDialogComponent>, public storage: LocalStorageService, private element: ElementRef) { }

  ngOnInit(): void {
    this.dialogRef.disableClose = !this.storage.hasReadTerms();

    this.dialogRef.backdropClick().subscribe(() => {
      if (!this.storage.hasReadTerms()) {
        let terms: HTMLElement = this.element.nativeElement.querySelector("#terms");

        if (terms) {
          terms.scrollIntoView({behavior: 'smooth'});
          this.blinkCheckbox();
        }
      }
    });
  }

  public acceptTerms(): void {
    if (!this.checked) {
      this.blinkCheckbox();
    } else {
      this.storage.acceptStorageTerms();
      this.dialogRef.close();
    }
  }

  private blinkCheckbox():void {
    let checkbox: HTMLAreaElement = this.element.nativeElement.querySelector("#checkbox");

    if (checkbox) {
      checkbox.classList.add("blink");

      setTimeout(() => checkbox.classList.remove("blink"), 2000);
    }
  }
}
