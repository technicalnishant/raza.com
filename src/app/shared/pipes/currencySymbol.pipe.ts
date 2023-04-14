import { Pipe, PipeTransform } from '@angular/core';
import { RazaEnvironmentService } from '../../core/services/razaEnvironment.service';
import { CurrencyCode } from '../../core/interfaces/CurrencyCode';
import { Observable, of } from "rxjs";
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({ name: 'sCurrency' })
export class currencySmallSymbolPipe implements PipeTransform {
  constructor(private razaEnvService: RazaEnvironmentService) { }
  currencySymbol: string;

  transform(value: number, currency: CurrencyCode): any {
   
    if (currency == CurrencyCode.GBP) 
    {
      this.currencySymbol = "p";
      return value + "" + this.currencySymbol;
    }
    else if (currency == CurrencyCode.INR) 
    {
      this.currencySymbol = "p";
      return value + "" + this.currencySymbol;
    }
    else if (currency == CurrencyCode.AUD) 
    {
      this.currencySymbol = "¢";
      return value + "" + this.currencySymbol;
    }
    else if (currency == CurrencyCode.NZD) 
    {
      this.currencySymbol = "¢";
      return value + "" + this.currencySymbol;
    }
    else 
    {
      this.currencySymbol = "¢";
      return value + "" + this.currencySymbol;
    }

    //return value + "" +localStorage.getItem('subCurrencySymbol');
    
  }
}

@Pipe({ name: 'bCurrency' })
export class currencyMainSymbolPipe implements PipeTransform {
  constructor(private razaEnvService: RazaEnvironmentService) { }
  currencySymbol: string = "$";
  transform(value: number, currency: CurrencyCode): string {
    if (currency == CurrencyCode.GBP) 
    {
      this.currencySymbol = "£";
      return this.currencySymbol + "" + value;
    }
    else if (currency == CurrencyCode.INR) 
    {
      this.currencySymbol = "₹";
      return value + "" + this.currencySymbol;
    }
    else if (currency == CurrencyCode.AUD) 
    {
      this.currencySymbol = "$";
      return value + "" + this.currencySymbol;
    }
    else if (currency == CurrencyCode.NZD) 
    {
      this.currencySymbol = "$";
      return value + "" + this.currencySymbol;
    }
    else 
    {
      this.currencySymbol = "$";
      return this.currencySymbol + "" + value;
    }
    
  //  return this.razaEnvService.getCurrencySymbol()+ "" +this.razaEnvService.getFormatedPrice(value);
     //return localStorage.getItem('currencySymbol')+ "" + value;

  }
}