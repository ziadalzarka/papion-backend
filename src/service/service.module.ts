import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { PlaceServiceSchema, ServiceSchema, PersonServiceSchema } from 'app/service/service.schema';
import { ServiceService } from 'app/service/service.service';
import { ServiceSearchResolver } from 'app/service/service-search.resolver';
import { UserModule } from 'app/user';
import { PersonResolverResolver } from 'app/service/person-resolver.resolver';
import { PlaceResolverResolver } from 'app/service/place-resolver.resolver';

@Module({
  imports: [
    forwardRef(() => UserModule),
    MongooseModule.forFeature([{ name: 'Service', schema: ServiceSchema }]),
  ],
  providers: [
    ServiceService,
    {
      provide: getModelToken('PlaceService'),
      useFactory: (model) => model.discriminator('PlaceService', PlaceServiceSchema),
      inject: [getModelToken('Service')],
    },
    {
      provide: getModelToken('PersonService'),
      useFactory: (model) => model.discriminator('PersonService', PersonServiceSchema),
      inject: [getModelToken('Service')],
    },
    ServiceSearchResolver,
    PersonResolverResolver,
    PlaceResolverResolver,
  ],
  exports: [ServiceService],
})
export class ServiceModule { }
