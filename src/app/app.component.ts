import { Component, AfterViewInit } from '@angular/core';
import { LocalStorageService } from 'src/assets/services/data-classes/local-storage/local-storage.service';
import { InitialDialogComponent } from './initial-dialog/initial-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  title = 'Campo Minado';

  constructor(private matDialog: MatDialog, public storage: LocalStorageService) { }

  ngAfterViewInit(): void {
    if (!this.storage.hasReadTerms()) {
      this.matDialog.open(InitialDialogComponent, {
        width: "90vw"
      });
    }
  }
}
