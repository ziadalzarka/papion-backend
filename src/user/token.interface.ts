export enum AuthenticationScope {
  WeddingWebsites = 'wedding_websites',
  Reserve = 'reserve',
  ManageReservations = 'manage_reservations',
  RegisterPlaceBusiness = 'register_place_business',
  RegisterPersonBusiness = 'register_person_business',
  AdminPackages = 'admin_packages',
}

export interface AuthenticationToken {
  _id: string;
  iat: number;
  scopes: AuthenticationScope[];
}
