declare module 'bottleneck' {
  interface BottleneckOptions {
    maxConcurrent?: number;
    minTime?: number;
    highWater?: number;
    strategy?: number;
    rejectOnDrop?: boolean;
    id?: string;
    clearDatastore?: boolean;
    timeout?: number;
    Promise?: typeof Promise;
    reservoir?: number;
  }

  class Bottleneck {
    constructor(options?: BottleneckOptions);

    schedule<T>(fn: () => Promise<T>): Promise<T>;
    schedule<T>(fn: () => T): Promise<T>;
    schedule<T>(
      options: { priority?: number; weight?: number },
      fn: () => Promise<T>
    ): Promise<T>;
    schedule<T>(
      options: { priority?: number; weight?: number },
      fn: () => T
    ): Promise<T>;

    ready(): Promise<number>;
    running(): number;
    queued(): number;
    counts(): {
      RUNNING: number;
      QUEUED: number;
      EXECUTING: number;
      DONE: number;
    };

    on(event: string, callback: (...args: any[]) => void): void;
    removeAllListeners(event?: string): void;

    stop(): Promise<void>;
    updateSettings(options: Partial<BottleneckOptions>): void;
  }

  export = Bottleneck;
}
