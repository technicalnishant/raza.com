import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { LandingPageService } from '../../landing-page.service';
///import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';

@Component({
  selector: 'app-message-us-all',
  templateUrl: './message-us-all.component.html',
  styleUrls: ['./message-us-all.component.scss']
})
export class MessageUsAllComponent {
  messageUsForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<MessageUsAllComponent>
  ) {
  }

  ngOnInit() {

  }

  closeIcon(): void {
    this.dialogRef.close();
  }

  onMessageUsSubmit() {

  }
} 
