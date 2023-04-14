import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-faq-page',
  templateUrl: './faq-page.component.html',
  styleUrls: ['./faq-page.component.scss']
})
export class FaqPageComponent {
  isShow:any;
  constructor(
    public dialogRef: MatDialogRef<FaqPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.isShow=data.slideIndex;
	  
     }

  closeIcon(): void {
    this.dialogRef.close();
  }
}
