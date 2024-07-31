import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { User } from "./user.entity";
import { appDataSource } from "../../bootstrap/dataSource";

@Resolver(User)
export class UserResolver {
  private userRepository = appDataSource.getRepository(User);

  @Query(() => [User])
  async users(): Promise<User[]> {
    return await this.userRepository.find();
  }

  @Query(() => User)
  async userWithPosts(@Arg("userId") userId: number): Promise<User | undefined> {
    const user = await this.userRepository.createQueryBuilder("user")
      .leftJoinAndSelect("user.posts", "post")
      .where("userId = :userId", {userId})
      .getOne();
    console.log(await user.posts);
    return user;
  }

  @Mutation(() => User)
  async addUser(
    @Arg("name") name: string,
    @Arg("email") email: string
  ): Promise<User> {
    const user = this.userRepository.create({ name, email, active: true });
    return await this.userRepository.save(user);
  }
}
