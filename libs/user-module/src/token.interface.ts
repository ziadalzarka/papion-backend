export enum AuthenticationScope {
  WeddingWebsites = 'wedding_websites',
  RegisterPlaceBusiness = 'register_person_business',
  RegisterPersonBusiness = 'register_person_business',
}

export interface AuthenticationToken {
  _id: string;
  iat: number;
  scopes: AuthenticationScope[];
}
