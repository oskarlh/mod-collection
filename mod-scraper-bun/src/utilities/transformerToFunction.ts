export type StreamAsFunction<InputObjectType, OutputObjectType> = ((
	input: InputObjectType,
) => Promise<OutputObjectType>) &
	Partial<AsyncDisposable>;

// Only works with one-to-one transformers that output results in input order
export function transformerToFunction<InputObjectType, OutputObjectType>({
	readable,
	writable,
}: {
	readable: ReadableStream<OutputObjectType>;
	writable: WritableStream<InputObjectType>;
}): StreamAsFunction<InputObjectType, OutputObjectType> {
	const writer = writable.getWriter();
	const reader = readable.getReader();

	reader.read();

	const func: StreamAsFunction<InputObjectType, OutputObjectType> = async (
		input: InputObjectType,
	): Promise<OutputObjectType> => {
		writer.write(input);

		const { done, value } = await reader.read();
		if (done) {
			throw new Error("Stream closed");
		}
		return value;
	};
	func[Symbol.asyncDispose] = async () => {
		await writer.close();
		await reader.closed;
	};

	return func as StreamAsFunction<InputObjectType, OutputObjectType>;
}
