//import { secrets } from "../../secrets.ts";
import { createClient } from "./generatedClient/client/index.ts";
import { TwhlApiClient } from "./generatedClient/sdk.gen.ts";

function createTwhlApiClient() {
	return new TwhlApiClient({
		client: createClient({
			auth: () => "1767913795-1-1RpVKjkK0HwAllkkiHH0RHzv3tDTzOFSgS4Czl9qWof3LGBFADl9ks822Gxu",
			//			secrets.twhlClientApiKey,
			baseUrl: "http://localhost:82/api",
			headers: {
				"X-Requested-With": "XMLHttpRequest",
			},
			//	fetch: ((...params: Parameters<typeof fetch>) => {
			//		console.log(params);
			//		return fetch(...params);
			//	}) as typeof fetch,

			throwOnError: true,
		}),
	});
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
