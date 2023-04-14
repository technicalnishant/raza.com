import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-update-password-success',
    templateUrl: 'update-password-success.dialog.html'
})

export class UpdatePasswordSuccessDialog implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<UpdatePasswordSuccessDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private router: Router,
    ) { }

    ngOnInit() { }

    onClickOk(): void{
        this.closeIcon();
        this.router.navigateByUrl('/account');
    }

    closeIcon(): void {
        this.dialogRef.close();
      }
}