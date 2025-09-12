declare module 'axios-retry' {
  import { AxiosInstance, AxiosError } from 'axios';

  interface AxiosRetryConfig {
    retries?: number;
    retryDelay?: (retryCount: number) => number;
    retryCondition?: (error: AxiosError) => boolean;
  }

  function axiosRetry(axios: AxiosInstance, config: AxiosRetryConfig): void;

  namespace axiosRetry {
    function isNetworkOrIdempotentRequestError(error: AxiosError): boolean;
  }

  export = axiosRetry;
}
