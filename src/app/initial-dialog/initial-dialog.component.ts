import { Component } from '@angular/core';

@Component({
  selector: 'app-initial-dialog',
  templateUrl: './initial-dialog.component.html',
  styleUrls: ['./initial-dialog.component.scss']
})
export class InitialDialogComponent {
  public static getConfig(): any {
    return {
      width: '90vw'
    }
  }
}
