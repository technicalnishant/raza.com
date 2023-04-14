import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContactusService } from '../../contactus.service';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';

@Component({
  selector: 'app-message-us',
  templateUrl: './message-us.component.html',
  styleUrls: ['./message-us.component.scss']
})
export class MessageUsComponent {
  messageUsForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<MessageUsComponent>, private companyService: ContactusService,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.messageUsForm = this.formBuilder.group({
      emailOrPhone: ['', [Validators.required]],
      typeOfQuestion: ['', Validators.required],
      comments: ['', Validators.required]
    });
  }

  closeIcon(): void {
    this.dialogRef.close();
  }

  onMessageUsSubmit() {
    if (this.messageUsForm.invalid) {
      return;
    }

    var messageUs = {
      Email: this.messageUsForm.get('emailOrPhone').value,
      PhoneNumber: this.messageUsForm.get('emailOrPhone').value,
      Region: this.messageUsForm.get('typeOfQuestion').value,
      Note: this.messageUsForm.get('comments').value
    };

    this.companyService.postMessageUs(messageUs).subscribe(
      (response) => {
        this.dialogRef.close(true);
      },
      (err: ApiErrorResponse) => console.log(err),
    );
  }
} 
