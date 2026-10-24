export class BatchingStream<ObjectType> extends TransformStream<ObjectType, ObjectType[]> {
	constructor({
		batchSizeLimit, // 1 or more, integer
		maxDelay = 0, // 0 or more seconds
	}: {
		batchSizeLimit: number;
		maxDelay?: number;
	}) {
		let currentBatch: ObjectType[] = [];
		let flushingTimeout: NodeJS.Timeout | undefined;

		const flush = (controller: TransformStreamDefaultController<ObjectType[]>) => {
			if (currentBatch.length) {
				clearTimeout(flushingTimeout);
				controller.enqueue(currentBatch);
				currentBatch = [];
			}
		};

		const transform = (
			chunk: ObjectType,
			controller: TransformStreamDefaultController<ObjectType[]>,
		) => {
			currentBatch.push(chunk);
			if (currentBatch.length >= batchSizeLimit) {
				flush(controller);
			} else if (currentBatch.length === 1) {
				// TODO remove `as NodeJS.Timeout`
				flushingTimeout = setTimeout(flush, maxDelay * 1_000) as NodeJS.Timeout;
			}
		};

		// TODO: set high water marks
		super({
			flush,
			transform,
		});
	}
}
