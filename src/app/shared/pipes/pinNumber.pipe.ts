import { Pipe, PipeTransform } from '@angular/core';
import { isNullOrUndefined } from 'util';

@Pipe({ name: 'pinNumber' })
export class pinNumberPipe implements PipeTransform {
    constructor() { }
    pinNumberSymbol: string = "XXXXX";
    transform(value: number, type: string): string {
        return value.toString().slice(0, 2) + this.pinNumberSymbol + value.toString().slice(-3);
    }
}