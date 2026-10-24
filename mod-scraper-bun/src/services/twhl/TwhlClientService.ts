//import { secrets } from "../../secrets.ts";
import { setTimeout as asyncSetTimeout } from "node:timers/promises";
import { createClient, type Options } from "./generatedClient/client/index.ts";
import { type GetVaultItemsPagedData, type VaultItem } from "./generatedClient/index.ts";
import { TwhlApiClient } from "./generatedClient/sdk.gen.ts";

type VaultItemWithExpectedProperties = VaultItem &
	Required<Pick<VaultItem, "id" | "name" | "category_id" | "type_id" | "game" | "updated_at">>;

const tooManyRequestsBackoffTimeMilliseconds = 10_000;
const tooManyRequestsResponseCode = 429;

function uniqueById<T extends { id?: unknown }>(objects: T[]): T[] {
	return [...new Map(objects.map((v) => [v.id, v])).values()];
}

export class TwhlClientService {
	#client = new TwhlApiClient({
		client: createClient({
			auth: () => "1767913795-1-1RpVKjkK0HwAllkkiHH0RHzv3tDTzOFSgS4Czl9qWof3LGBFADl9ks822Gxu",
			//			secrets.twhlClientApiKey,
			baseUrl: "http://localhost:82/api",
			fetch: (async (...params: Parameters<typeof fetch>): Promise<Response> => {
				const signal = params[1]?.signal ?? undefined;
				while (true) {
					const response = await fetch(...params);
					if (response.status !== tooManyRequestsResponseCode) {
						return response;
					}
					await asyncSetTimeout(tooManyRequestsBackoffTimeMilliseconds, undefined, { signal });
				}
			}) as typeof fetch,

			headers: {
				// So the user doesn't show up in the "Onliners" section
				"X-Requested-With": "XMLHttpRequest",
			},

			throwOnError: true,
		}),
	});

	async getVaultItemsPaged(options: Options<GetVaultItemsPagedData, true>): Promise<{
		items: VaultItemWithExpectedProperties[];
		page: number;
		pages: number;
		total: number;
	}> {
		const {
			data: { items, ...rest },
		} = await this.#client.getVaultItemsPaged(options);
		return { items: items as VaultItemWithExpectedProperties[], ...rest };
	}

	async checkForNewOrUpdatedVaultItems(
		lastUpdatedId: number,
		lastUpdatedTime: Temporal.Instant,
	): Promise<boolean> {
		const {
			items: [item],
		} = await this.getVaultItemsPaged({
			query: {
				count: 1,
				sort_by: "updated_at",
				sort_descending: true,
			},
		});
		if (item === undefined) {
			return false;
		}

		const timeComparison = Temporal.Instant.compare(
			lastUpdatedTime,
			item.updated_at.toTemporalInstant(),
		);

		return timeComparison < 0 || (timeComparison === 0 && lastUpdatedId !== item.id);
	}

	async getNewOrUpdatedVaultItems(
		lastUpdatedId: number,
		lastUpdatedTime: Temporal.Instant,
	): Promise<VaultItemWithExpectedProperties[]> {
		if (!(await this.checkForNewOrUpdatedVaultItems(lastUpdatedId, lastUpdatedTime))) {
			return [];
		}

		let pageNum = 1; // Starts at 1
		const allItems: VaultItemWithExpectedProperties[] = [];
		while (true) {
			const { items, page, pages } = await this.getVaultItemsPaged({
				query: {
					count: 20,
					page: pageNum,
					sort_by: "updated_at",
					sort_descending: true,
				},
			});
			for (const item of items) {
				const timeComparison = Temporal.Instant.compare(
					lastUpdatedTime,
					item.updated_at.toTemporalInstant(),
				);
				if (timeComparison > 0 || (timeComparison === 0 && lastUpdatedId === item.id)) {
					return uniqueById(allItems);
				}
				allItems.push(item);
			}
			if (page === pages) {
				return uniqueById(allItems);
			}

			pageNum = page + 1;
		}
	}

	async getAllVaultItems(): Promise<VaultItemWithExpectedProperties[]> {
		let pageNum = 1; // Starts at 1
		const allItems: VaultItemWithExpectedProperties[] = [];
		while (true) {
			const { items, page, pages } = await this.getVaultItemsPaged({
				query: {
					count: 100,
					page: pageNum,
					sort_descending: true,
				},
			});
			allItems.push(...items);
			if (page === pages) {
				return uniqueById(allItems);
			}

			pageNum = page + 1;
		}
	}
}

/*const res = await createTwhlApiClient().createShout({
	body: {
		text: "LOLyurmum",
	},
});

const resdf = await t.getVaultItemsPaged({
	query: {
		sort_by: "updated_at",
		sort_descending: false,
	},
});

const resf = await t.getShoutsCreatedFrom({
	query: {
		timestamp: 9999,
	},
});*/

//const comp = await createTwhlApiClient().getCompetitionsPaged<false>({
//	query: {
//		expand: ["judge_type", "status", "type"],
//		id: [1, 2, 3],
//		page: 3,
//	},
//});

//console.log(comp.data.items[0]?.judge_type);
//console.log(comp.response.headers.get("x-ratelimit-remaining"));
//const resf = await createTwhlApiClient().getShoutsCreatedFrom({
//	query: {
//		timestamp: 9999,
//	},
//});

//console.log(resf.data);
