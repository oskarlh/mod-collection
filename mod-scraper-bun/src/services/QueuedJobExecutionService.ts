declare const queueKeyParamsTag: unique symbol;

type QueueKey<Param> = symbol & { [queueKeyParamsTag]: Param };
type ParamForQueue<QK extends QueueKey<any>> = QK extends QueueKey<infer Param> ? Param : never;
type CallbackForQueue<QK extends QueueKey<any>> =
	QK extends QueueKey<infer Param> ? (param: Param) => Promise<void> : never;

function createQueueKey<Param>(): QueueKey<Param> {
	return Symbol() as QueueKey<Param>;
}

const downloadTwhlMapQueue = createQueueKey<{ bar: 1024; foo: boolean }>();

function inSomeService() {
	const queuedJobExecutionService = new QueuedJobExecutionService();
	queuedJobExecutionService.setUpQueues({
		[downloadTwhlMapQueue]: async ({ bar, foo }: ParamForQueue<typeof downloadTwhlMapQueue>) => {
			const signal = AbortSignal.timeout(5_000);
			if (bar) {
			}

			queuedJobExecutionService.enqueue(downloadTwhlMapQueue, { bar: 1024, foo: false });
		},
	});
	queuedJobExecutionService.enqueue(downloadTwhlMapQueue, { bar: 1024, foo: true });
}

type QueueState = {
	callback: (param: any) => Promise<void>;
	inProgressRun: Promise<void> | undefined;
	queuedWork: any[];
	stopping: boolean;
};

class QueueOwner implements AsyncDisposable {
	#queueStates: QueueState[] = [];
	#ownerSet: Set<QueueOwner>;

	constructor(queueStates: QueueState[], ownerSet: Set<QueueOwner>) {
		this.#queueStates = queueStates;
		this.#ownerSet = ownerSet;
	}

	async stop({ finishQueuesFirst }: { finishQueuesFirst: boolean }): Promise<void> {
		for (const state of this.#queueStates) {
			state.stopping = true;
			if (!finishQueuesFirst) {
				state.queuedWork = [];
			}
		}
		do {
			await Promise.allSettled(this.#queueStates.map(({ inProgressRun }) => inProgressRun));
		} while (this.#queueStates.some(({ inProgressRun }) => !!inProgressRun));
		this.#ownerSet.delete(this);
	}

	async [Symbol.asyncDispose](): Promise<void> {
		this.stop({ finishQueuesFirst: true });
	}
}

export class QueuedJobExecutionService implements AsyncDisposable {
	#owners = new Set<QueueOwner>();
	#queues = new WeakMap<QueueKey<any>, QueueState>();

	enqueue<QK extends QueueKey<any>>(queueKey: QK, parameter: ParamForQueue<QK>) {
		const queueState = this.#getQueueForQueueing(queueKey);
		queueState.queuedWork.push(parameter);
		if (!queueState.inProgressRun) {
			this.#workOnQueue(queueState);
		}
	}

	lengthOfQueue(queueKey: QueueKey<any>): number {
		return this.#queues.get(queueKey)?.queuedWork.length ?? 0;
	}

	prepend<QK extends QueueKey<any>>(queueKey: QK, parameter: ParamForQueue<QK>) {
		const queueState = this.#getQueueForQueueing(queueKey);
		queueState.queuedWork.unshift(parameter);
		if (!queueState.inProgressRun) {
			this.#workOnQueue(queueState);
		}
	}

	setUpQueues(config: Record<QueueKey<any>, (param: any) => Promise<void>>): QueueOwner {
		const newQueueStates: QueueState[] = [];
		for (const queueKey of Object.getOwnPropertySymbols(config) as (keyof typeof config)[]) {
			const callback = config[queueKey];
			if (!callback) {
				continue;
			}
			if (this.#queues.get(queueKey)?.stopping === false) {
				throw new Error("Queue already registered");
			}
			const state = {
				callback,
				inProgressRun: undefined,
				queuedWork: [],
				stopping: false,
			};
			this.#queues.set(queueKey, state);
			newQueueStates.push(state);
		}

		const owner = new QueueOwner(newQueueStates, this.#owners);
		this.#owners.add(owner);
		return owner;
	}

	#getQueueForQueueing<QK extends QueueKey<any>>(queueKey: QK): QueueState {
		const state = this.#queues.get(queueKey);
		if (state === undefined) {
			throw new Error("Queue not registered");
		}
		if (state.stopping) {
			throw new Error("Queue stopped/stopping");
		}
		return state;
	}

	async #workOnQueue(queueState: QueueState) {
		while (!queueState.stopping && !queueState.inProgressRun && queueState.queuedWork.length) {
			queueState.inProgressRun = queueState.queuedWork
				.shift()
				.catch(() => undefined)
				.then(() => {
					queueState.inProgressRun = undefined;
				});

			await queueState.inProgressRun;
		}
	}

	async [Symbol.asyncDispose](): Promise<void> {
		await Promise.allSettled(this.#owners.values().map((owner) => owner[Symbol.asyncDispose]()));
	}
}
