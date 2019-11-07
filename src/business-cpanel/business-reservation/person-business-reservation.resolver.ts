import { graphqlMongodbProjection } from '@gray/graphql-essentials';
import { Args, Info, Parent, ResolveProperty, Resolver } from '@nestjs/graphql';
import { ReservationsPage } from 'app/reservation/reservation.dto';
import { PersonServiceEntity } from 'app/service/service.dto';
import { IPersonService } from 'app/service/service.schema';
import { GraphQLResolveInfo } from 'graphql';
import { BusinessReservationService } from './business-reservation.service';
import { AuthScopes } from 'app/user/scope.decorator';
import { AuthenticationScope } from 'app/user/token.interface';

@Resolver(of => PersonServiceEntity)
export class PersonBusinessReservationResolver {

  constructor(private businessReservationService: BusinessReservationService) { }

  @ResolveProperty('reservations', type => ReservationsPage)
  @AuthScopes([AuthenticationScope.ManageReservations])
  async personBusinessReservations(
    @Parent() personService: IPersonService,
    @Args({ name: 'page', type: () => Number }) page: number,
    @Info() info: GraphQLResolveInfo) {
    return await this.businessReservationService.listServiceReservations(personService._id, page, graphqlMongodbProjection(info));
  }
}
