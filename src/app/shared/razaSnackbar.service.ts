import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NotificationDialogComponent } from "./dialog/notification-dialog/notification-dialog.component";
import { NotificationRibbonComponent } from "./dialog/notification-ribbon/notification-ribbon.component";
import { MatDialog } from '@angular/material/dialog';
@Injectable({ providedIn: 'root' })
export class RazaSnackBarService {
    constructor(public snackBar: MatSnackBar, private dialog: MatDialog,) { }


    public openWarning(message: string) {
        this._openSnackBar(message, 'warning', true);
    }

    public openSuccess(message: string, closable?: true) {
        this._openSnackBar(message, 'success', true);
    }

    public openError(message: string, closable?: true) {
        //this._openSnackBar(message, 'error', true);

        this.dialog.open(NotificationDialogComponent, {
            
            data: { message: message, closable: closable, type: closable },
            panelClass: 'notification-popup'
          });
    }

    public _openSnackBar(message: string, type: string = 'warning | success | info | error', closable?: boolean) {
       this.snackBar.openFromComponent(NotificationRibbonComponent, {
            verticalPosition: 'top',
            data: { message: message, closable: closable, type: type },
            panelClass: 'raza-notify-ribbon',
            duration: closable ? null : 2000
        }); 
         
    }


    public openSnackDialog(message: string, type: string = 'warning | success | info | error', closable?: boolean) {
       /* this.snackBar.openFromComponent(NotificationDialogComponent, {
            verticalPosition: 'top',
            data: { message: message, closable: closable, type: type },
            panelClass: 'raza-notify-ribbon',
            duration: closable ? null : 2000
        });
*/
        this.dialog.open(NotificationDialogComponent, {
            
            data: { message: message, closable: closable, type: type },
            panelClass: 'notification-popup'
          });
    }
    
}