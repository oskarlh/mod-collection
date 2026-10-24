import { ChildEntity, ManyToOne } from "typeorm";
import type { TwhlUser } from "./TwhlUser.ts";
import { Posting, PostingSource } from "./Posting.ts";

@ChildEntity(PostingSource.TWHL)
export class TwhlVaultPosting extends Posting {
	@ManyToOne("TwhlUser", (creatorTwhlUser: TwhlUser) => creatorTwhlUser.twhlVaultPostings, {
		nullable: false,
	})
	creatorTwhlUser!: TwhlUser;
}
