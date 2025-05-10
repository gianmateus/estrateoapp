declare module 'swr' {
  export interface SWRConfiguration {
    fetcher?: any;
    suspense?: boolean;
    revalidateOnFocus?: boolean;
    revalidateOnMount?: boolean;
    revalidateOnReconnect?: boolean;
    refreshInterval?: number;
    dedupingInterval?: number;
    focusThrottleInterval?: number;
    loadingTimeout?: number;
    errorRetryInterval?: number;
    errorRetryCount?: number;
    shouldRetryOnError?: boolean;
    initialData?: any;
    isPaused?: () => boolean;
    onLoadingSlow?: (key: string, config: SWRConfiguration) => void;
    onSuccess?: (data: any, key: string, config: SWRConfiguration) => void;
    onError?: (err: Error, key: string, config: SWRConfiguration) => void;
    onErrorRetry?: (err: Error, key: string, config: SWRConfiguration, revalidate: Function, revalidateOpts: any) => void;
    compare?: (a: any, b: any) => boolean;
    fallbackData?: any;
  }

  export interface SWRResponse<Data = any, Error = any> {
    data?: Data;
    error?: Error;
    revalidate: () => Promise<boolean>;
    mutate: (data?: Data | Promise<Data> | ((currentData?: Data) => Promise<Data | undefined> | Data | undefined), shouldRevalidate?: boolean) => Promise<Data | undefined>;
    isValidating: boolean;
    isLoading: boolean;
  }

  export default function useSWR<Data = any, Error = any>(
    key: string | null | (() => string | null),
    fetcher?: (key: string) => Promise<Data>,
    config?: SWRConfiguration
  ): SWRResponse<Data, Error>;
} 