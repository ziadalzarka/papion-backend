import { Resolver, Query, ResolveProperty, Parent, Args, Info } from '@nestjs/graphql';
import { PlaceServiceEntity } from 'app/service/service.dto';
import { ReservationsPage } from 'app/reservation/reservation.dto';
import { IPlaceService } from 'app/service/service.schema';
import { GraphQLResolveInfo } from 'graphql';
import { BusinessReservationService } from './business-reservation.service';
import { graphqlMongodbProjection } from '@gray/graphql-essentials';
import { AuthenticationScope } from 'app/user/token.interface';
import { AuthScopes } from 'app/user/scope.decorator';

@Resolver(of => PlaceServiceEntity)
export class PlaceBusinessReservationResolver {

  constructor(private businessReservationService: BusinessReservationService) { }

  @ResolveProperty('reservations', type => ReservationsPage)
  @AuthScopes([AuthenticationScope.ManageReservations])
  async resolvePersonBusinessReservations(
    @Parent() placeService: IPlaceService,
    @Args({ name: 'page', type: () => Number }) page: number,
    @Info() info: GraphQLResolveInfo) {
    return await this.businessReservationService.listServiceReservations(placeService._id, page, graphqlMongodbProjection(info));
  }
}
