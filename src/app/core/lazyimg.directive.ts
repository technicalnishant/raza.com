import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[img, appLazyimg]'
})
export class LazyimgDirective {

  onstructor({ nativeElement }: ElementRef<HTMLImageElement>) {
    const supports = 'loading' in HTMLImageElement.prototype;

    if (supports) {
      nativeElement.setAttribute('loading', 'lazy');
    }
  }

}
