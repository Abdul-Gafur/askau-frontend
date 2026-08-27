type FetchFn = typeof fetch;

export function withInterceptors(
  fetchFn: FetchFn,
  requestInterceptors: Array<
    (input: RequestInfo | URL, init?: RequestInit) => [RequestInfo | URL, RequestInit | undefined]
  > = [],
  responseInterceptors: Array<(response: Response) => Response | Promise<Response>> = [],
): FetchFn {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    let currentInput = input;
    let currentInit = init;

    for (const interceptor of requestInterceptors) {
      const [newInput, newInit] = interceptor(currentInput, currentInit);
      currentInput = newInput;
      currentInit = newInit;
    }

    let response = await fetchFn(currentInput, currentInit);

    for (const interceptor of responseInterceptors) {
      response = await interceptor(response);
    }

    return response;
  };
}
