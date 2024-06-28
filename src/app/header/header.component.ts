import { Component } from '@angular/core';
import { LocalStorageService } from 'src/assets/services/data-classes/local-storage/local-storage.service';
import { InitialDialogComponent } from '../initial-dialog/initial-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor (private matDialog: MatDialog, public clearMemory: LocalStorageService) { }

  public openHelp(): void {
    this.matDialog.open(InitialDialogComponent, {
      width: "90vw"
    });
  }
}
