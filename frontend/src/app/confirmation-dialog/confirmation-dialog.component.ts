import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {
  @Output() deleteEventEmitter = new EventEmitter<void>();
  error = false;

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>) {}

  onDelete() {
    this.deleteEventEmitter.emit();
  }
}
