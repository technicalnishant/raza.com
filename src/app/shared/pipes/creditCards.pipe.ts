import { Pipe, PipeTransform } from '@angular/core';
//import { isNullOrUndefined } from 'util';
import { isNullOrUndefined } from "../../shared/utilities";

@Pipe({ name: 'creditCard' })
export class creditCardsPipe implements PipeTransform {
  constructor() { }
  creditCardSymbol: string = "";
  transform(value: number, type: string): string {
    return this.creditCardSymbol + "" + value.toString().slice(-4);
  }
}

@Pipe({ name: 'CreditCardStr' })
export class creditCardStrPipe implements PipeTransform {
  constructor() { }
  creditCardSymbolStr: string = "";
  transform(value: string): string {
    if (isNullOrUndefined(value))
      return this.creditCardSymbolStr;
    else
      return this.creditCardSymbolStr + "" + value.slice(-4);
  }
}

@Pipe({ name: 'CreditCardMask' })
export class creditCardMaskPipe implements PipeTransform {
  constructor() { }
  transform(value: string): string {
    if (!isNullOrUndefined(value))
      return value.slice(0, 4) + "-xxxx-xxxx-" + value.slice(-4);
  }
}