import {
	Column,
	ColumnOptions,
	PrimaryColumn,
	PrimaryColumnOptions,
	ValueTransformer,
} from "typeorm";

function addTransformer(
	firstTransformers: ValueTransformer | ValueTransformer[] = [],
	lastTransformer: ValueTransformer,
) {
	return [
		...(Array.isArray(firstTransformers) ? firstTransformers : [firstTransformers]),
		lastTransformer,
	];
}
const instantTransformer = {
	from: (dateTime: string) => Temporal.Instant.from(`${dateTime}Z`),
	to: (instant: Temporal.Instant) =>
		instant.toString({ smallestUnit: "microseconds" }).slice(0, -1).replace("T", " "),
} as const;

/**
 * Note: Postgres uses microsecond precision, while Temporal.Instant uses nanoseconds.
 * Precision may be lost due to rounding.
 */
export const InstantColumn = (options?: ColumnOptions) =>
	Column({
		...options,
		transformer: addTransformer(options?.transformer, instantTransformer),
		type: "timestamp without time zone",
	});

const int64Transformer = {
	from: BigInt,
	to: String,
} as const;

export const Int64Column = (options?: ColumnOptions) =>
	Column("bigint", {
		...options,
		transformer: addTransformer(options?.transformer, int64Transformer),
	});

const urlTransformer = {
	from: (urlString: string) => new URL(urlString),
	to: String,
} as const;

export const UrlColumn = (options?: ColumnOptions) =>
	Column("character varying", {
		length: 8_000,
		...options,
		transformer: addTransformer(options?.transformer, urlTransformer),
	});

export const UuidV7Column = (options?: ColumnOptions) => Column("uuid", options);

export const GeneratedUuidV7Column = (options?: ColumnOptions) =>
	Column("uuid", {
		...options,
		default: () => "uuidv7()",
	});

export const PrimaryGeneratedUuidV7Column = (options?: PrimaryColumnOptions) =>
	PrimaryColumn("uuid", {
		...options,
		default: () => "uuidv7()",
	});
