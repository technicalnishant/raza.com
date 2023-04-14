import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-enroll-reward',
    templateUrl: 'enroll-reward.dialog.html'
})

export class EnrollRewardDialog implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<EnrollRewardDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit() { }

    onClickOk(): void{
        this.dialogRef.close(true);
    }

    closeIcon(): void {
        this.dialogRef.close(false);
      }
}