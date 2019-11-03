import { UserService } from './user.service';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CreateClientUserInput, CreateBusinessUserInput, UserEntity, ClientUserEntity, BusinessUserEntity } from './user.dto';
import { UserType } from './user-type.dto';
import { ServiceService } from 'app/service/service.service';
import { ObjectID } from 'mongodb';
import { BusinessCategory } from './business-category.dto';

@Resolver('User')
export class UserResolver {

  constructor(private userService: UserService, private serviceService: ServiceService) { }

  @Mutation(returns => ClientUserEntity)
  async signUpClientUser(@Args({ type: () => CreateClientUserInput, name: 'payload' }) payload: CreateClientUserInput) {
    return await this.userService.createUser({ ...payload, userType: UserType.Client });
  }

  @Mutation(returns => BusinessUserEntity)
  async signUpBusinessUser(@Args({ type: () => CreateBusinessUserInput, name: 'payload' }) payload: CreateBusinessUserInput) {
    const doc = await this.userService.createUser({ ...payload, userType: UserType.Business });
    if (payload.businessCategory === BusinessCategory.Person) {
      await this.serviceService.updatePersonService(doc._id as any, {
        name: doc.name,
        address: doc.address,
        businessCategory: BusinessCategory.Person,
      });
    }
    return doc;
  }
}
