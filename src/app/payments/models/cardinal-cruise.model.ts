
export class Order {
  OrderDetails: OrderDetails;
  Cart: Cart[];
  Consumer: Consumer;
}


export class OrderDetails {
  OrderNumber: string;
  Amount: number;
  CurrencyCode: string;
  OrderDescription: string;
}

export class Cart {
  Name: string;
  Quantity: string;

}

export class Consumer {
  Email1: string;
  Account: Account;
  BillingAddress: Address;
  ShippingAddress: Address;

}

export class Account {
  AccountNumber: string;
  ExpirationMonth: string;
  ExpirationYear: string;
  NameOnCard: string;

}


export class Address {
  FirstName: string;
  LastName: string;
  Address1: string;
  City: string;
  State: string;
  CountryCode: string;
  PostalCode: string;

}
