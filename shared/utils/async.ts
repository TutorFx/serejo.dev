type AsyncEnvelope<TData> = {
  data: TData;
  error: null;
} | {
  data: null;
  error: Error;
};

export async function asyncEnvelope<TData>(
  asyncFunction: () => Promise<TData>
): Promise<AsyncEnvelope<TData>> {
  try {
    const data = await asyncFunction();
    return { data: data, error: null };
  } catch (error) {
    const typedError = error instanceof Error ? error : new Error(String(error));
    console.error("Ocorreu um erro na execução:", typedError.message);
    return { data: null, error: typedError };
  }
}