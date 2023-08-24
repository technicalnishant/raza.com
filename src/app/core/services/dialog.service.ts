import { Injectable } from '@angular/core';
@Injectable({providedIn: 'root'})
 
export class DialogService {
  private isDialogOpen = false;

  setIsDialogOpen(value: boolean): void {
    this.isDialogOpen = value;
  }

  getIsDialogOpen(): boolean {
    return this.isDialogOpen;
  }
}
