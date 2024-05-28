export class userContext {
  constructor(
    public username: string,
    public firstName: string| null = null,
    public lastName: string | null = null,
    
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