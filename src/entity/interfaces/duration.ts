import { ObjectType, Field, InputType } from "type-graphql";

@ObjectType()
@InputType("DurationInput")
export class Duration {
  @Field()
  start: Date;
  @Field({ nullable: true })
  end?: Date;
  @Field({ nullable: true })
  present?: boolean;
}
