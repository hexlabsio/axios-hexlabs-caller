import { axiosSdkCaller } from './sdk-caller.js';

type ClassFor<T> = { new (...args: any[]): T };

type SdkReturns<
  SDK,
  K extends keyof SDK,
  Expects extends number,
> = SDK[K] extends (...args: any) => Promise<infer R>
  ? R extends { statusCode: Expects; result: infer Result }
    ? Result
    : never
  : never;

export interface CallStatus<T> {
  loading: boolean;
  failed: boolean;
  succeeded: boolean;
  started: boolean;
  result?: T;
}

export function createSdkCaller<SDK, const K extends keyof SDK, const Expects extends number>(
  sdk: ClassFor<SDK>,
  call: K,
  expecting: Expects,
  authSupplier: () => string,
  serverLookupSupplier: () => string,
  reactLike: {
    useCallback<T extends Function>(callback: T, deps: readonly unknown[]): T,
    useState<S>(initialState: S | (() => S)): [S, (value: S | ((prevState: S) => S)) => void];
  }
): SDK[K] extends (...args: infer P) => any
  ? {
    status: CallStatus<SdkReturns<SDK, K, Expects>>;
    reset: () => void;
    trigger: (
      ...params: P
    ) => Promise<SdkReturns<SDK, K, Expects>>;
  }
  : never {
  const auth = authSupplier();
  const caller = new sdk(axiosSdkCaller(auth), serverLookupSupplier());
  const [status, setStatus] = reactLike.useState<CallStatus<SdkReturns<SDK, K, Expects>>>({
    started: false,
    loading: false,
    failed: false,
    succeeded: false,
    result: undefined,
  });
  const trigger = reactLike.useCallback(
    async (...params: any) => {
      setStatus({
        started: true,
        loading: true,
        succeeded: false,
        failed: false,
      });
      try {
        const result = await (caller[call] as any)(...params);
        if (result.statusCode >= 200 && result.statusCode <= 201) {
          setStatus({
            started: true,
            loading: false,
            succeeded: true,
            failed: false,
            result: result.result,
          });
          // try {
          //   onComplete?.(result.result, ...params);
          // } catch (e) {
          //   // do nothing
          // }
        } else {
          setStatus({
            started: true,
            loading: false,
            succeeded: false,
            failed: true,
          });
        }
        return result.result;
      } catch (e) {
        setStatus({
          started: true,
          loading: false,
          succeeded: false,
          failed: true,
        });
      }
      return undefined;
    },
    [auth],
  );
  return {
    status,
    trigger,
    reset: () =>
      setStatus({
        started: true,
        loading: false,
        failed: false,
        succeeded: false,
      }),
  } as any;
}
