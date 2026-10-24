import { Column, Entity, Index, OneToMany } from "typeorm";
import { PrimaryGeneratedUuidV7Column } from "../columnDecorators.ts";
import { type UUID } from "node:crypto";
import type { TwhlVaultPosting } from "./TwhlVaultPosting.ts";

@Entity()
export class TwhlUser {
	@PrimaryGeneratedUuidV7Column()
	id!: UUID;

	@Column("integer")
	@Index({ unique: true })
	externalId!: number;

	@Column("character varying", {
		length: 255,
	})
	name!: string;

	@OneToMany(
		"TwhlVaultPosting",
		(twhlVaultPosting: TwhlVaultPosting) => twhlVaultPosting.creatorTwhlUser,
	)
	twhlVaultPostings!: TwhlVaultPosting[];
}
