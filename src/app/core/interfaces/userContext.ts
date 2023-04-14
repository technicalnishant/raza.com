export class userContext {
  constructor(
    public username: string,
    public accessToken: string,
    public refreshToken: string,
    public tokenType: string,
    public expiresIn: number,
    public issued: Date,
    public expire: Date,
    public isnew: boolean,
    public emailAddress: string,
    public countryId: number,
    public additionalId: any
  ) { }
};