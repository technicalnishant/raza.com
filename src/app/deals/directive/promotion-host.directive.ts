import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[promotion-host]',
})
export class PromotionHostDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}

