/**
 * RevenueRecover AI — Safe Exponential Backoff & Retry Engine
 * Retries transient network/503 errors while immediately failing permanent 401, 403, and policy rejections.
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffFactor?: number;
}

export class RetryEngine {
  /**
   * Executes an async operation with safe exponential backoff.
   */
  static async execute<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const maxRetries = options.maxRetries ?? 3;
    const initialDelay = options.initialDelayMs ?? 500;
    const maxDelay = options.maxDelayMs ?? 4000;
    const factor = options.backoffFactor ?? 2;

    let attempt = 0;
    let delay = initialDelay;

    while (true) {
      try {
        return await operation();
      } catch (error: any) {
        attempt++;

        // Permanent non-retryable errors
        const status = error.status || error.statusCode || (error.response ? error.response.status : undefined);
        const isNonRetryable =
          status === 401 ||
          status === 403 ||
          status === 404 ||
          (error.message && (
            error.message.includes('API key') ||
            error.message.includes('Unauthorized') ||
            error.message.includes('Forbidden') ||
            error.message.includes('Terms of Service')
          ));

        if (isNonRetryable || attempt >= maxRetries) {
          throw error;
        }

        // Wait with exponential backoff + jitter
        const jitter = Math.random() * 200;
        await new Promise((resolve) => setTimeout(resolve, Math.min(delay + jitter, maxDelay)));
        delay *= factor;
      }
    }
  }
}
