import { Component, OnInit } from '@angular/core';
import { InitialDialogComponent } from './initial-dialog/initial-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Campo-Minado';

  constructor(private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.matDialog.open(InitialDialogComponent, {
      width: '90vw'
    });
  }
}
