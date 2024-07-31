import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Post } from "./post.entity";
import { appDataSource } from "../../bootstrap/dataSource";

@Resolver(Post)
export class PostResolver {
  private postRepository = appDataSource.getRepository(Post);

  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return await this.postRepository.find();
  }

  @Mutation(() => Post)
  async addPost(
    @Arg("title") title: string,
    @Arg("content") content: string,
    @Arg("userId") userId: number
  ): Promise<Post> {
    const post = this.postRepository.create({ title, content, userId });
    return await this.postRepository.save(post);
  }
}
