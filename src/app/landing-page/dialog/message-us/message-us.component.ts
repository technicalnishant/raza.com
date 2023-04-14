import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { LandingPageService } from '../../landing-page.service';
///import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';

@Component({
  selector: 'app-message-us',
  templateUrl: './message-us.component.html',
  styleUrls: ['./message-us.component.scss']
})
export class MessageUsComponent {
  messageUsForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<MessageUsComponent>
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
