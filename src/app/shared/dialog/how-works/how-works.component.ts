import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-how-works',
  templateUrl: './how-works.component.html',
  styleUrls: ['./how-works.component.scss']
})
export class HowWorksComponent {
  isShow:any;
  country_id:any 
  constructor(
    public dialogRef: MatDialogRef<HowWorksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.isShow=data.slideIndex;
      this.country_id = data.country_id;
     }

  closeIcon(): void {
    this.dialogRef.close();
  }
}