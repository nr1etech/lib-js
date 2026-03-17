import {
  configureSync,
  getLogger,
  type Sink,
  type LogRecord,
} from '@logtape/logtape';
import * as os from 'os';

/**
 * The log levels supported by this library.
 */
export type LogLevel =
  | 'silent'
  | 'trace'
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'
  | 'fatal';

/**
 * Returns true if the given string is a valid log level.
 *
 * @param level The log level to check.
 */
export function isLevel(level: string): level is LogLevel {
  return [
    'silent',
    'trace',
    'debug',
    'info',
    'warn',
    'error',
    'fatal',
  ].includes(level);
}

/**
 * Distributed tracing details that can be sent to the log context.
 */
export interface DistributedTraceContext {
  /**
   * The trace-id header.
   */
  id: string;
  /**
   * The parent-id header.
   */
  parent: string;
  /**
   * The version header.
   */
  version: string;
  /**
   * The trace-flags header
   */
  flags: string;
}

/**
 * Represents a log entry.
 */
export interface Entry {
  str: (key: string, value: string | undefined | null) => Entry;
  num: (key: string, value: number | undefined | null) => Entry;
  bool: (key: string, value: boolean | undefined | null) => Entry;
  obj: (
    key: string,
    value: Record<string, unknown> | object | undefined | null,
  ) => Entry;
  unknown: (key: string, value: unknown) => Entry;
  err: (err: unknown) => Entry;
  msg: (msg: string, ...args: string[]) => void;
  send: () => void;
}

/**
 * The context that can be sent to the log context.
 */
export type Context = Record<string, unknown>;

const levelValues: Record<LogLevel, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
  silent: Infinity,
};

/**
 * Wrapper around a logtape logger that enforces a logging pattern similar to Zerolog and provides
 * an API that better supports the NR1E logging standard. Instances of this class should not be
 * shared between threads/workers. Instead, create a new child logger for each thread. The logger
 * itself is meant to be passed around as parameters to functions to support the contextual
 * structured logging pattern.
 */
export class Logger {
  public readonly svc: string;
  public readonly name: string | undefined;
  protected _bindings: Context;
  protected _level: LogLevel;
  protected _levelValue: number;
  protected entryCtx: Context;
  protected entry: Entry;
  protected entryLevel: LogLevel | null;

  constructor(
    svc: string,
    name?: string,
    bindings: Context = {},
    level: LogLevel = 'info',
  ) {
    this.svc = svc;
    this.name = name;
    this._bindings = {...bindings};
    this._level = level;
    this._levelValue = levelValues[level] ?? 30;
    this.entryCtx = {};
    this.entryLevel = null;
    this.entry = {
      msg: this.msg.bind(this),
      send: this.send.bind(this),
      str: this.str.bind(this),
      num: this.num.bind(this),
      bool: this.bool.bind(this),
      obj: this.obj.bind(this),
      unknown: this.unknown.bind(this),
      err: this.err.bind(this),
    };
  }

  protected str(key: string, value: string | undefined | null): Entry {
    this.entryCtx[key] = value;
    return this.entry;
  }

  protected num(key: string, value: number | undefined | null): Entry {
    this.entryCtx[key] = value;
    return this.entry;
  }

  protected bool(key: string, value: boolean | undefined | null): Entry {
    this.entryCtx[key] = value;
    return this.entry;
  }

  protected obj(
    key: string,
    value: object | Record<string, unknown> | undefined | null,
  ): Entry {
    this.entryCtx[key] = value;
    return this.entry;
  }

  protected unknown(key: string, value: unknown): Entry {
    this.entryCtx[key] = value;
    return this.entry;
  }

  protected err(err: unknown): Entry {
    if (err instanceof Error) {
      this.entryCtx['err'] = {
        type: err.name,
        message: err.message,
        stack: err.stack,
      };
    } else if (typeof err === 'object' && err !== null) {
      this.entryCtx['err'] = {
        ...(err as Record<string, unknown>),
        type:
          (err as {constructor?: {name?: string}}).constructor?.name ??
          'Object',
      };
    } else {
      this.entryCtx['err'] = err;
    }
    return this.entry;
  }

  private _doLog(level: LogLevel, msg: string, extraCtx: Context): void {
    if (level === 'silent') return;
    if (this._levelValue > (levelValues[level] ?? 30)) return;
    const allProps: Record<string, unknown> = {...this._bindings, ...extraCtx};
    const logger = getLogger([this.svc]);
    switch (level) {
      case 'trace':
        logger.trace(msg, allProps);
        break;
      case 'debug':
        logger.debug(msg, allProps);
        break;
      case 'info':
        logger.info(msg, allProps);
        break;
      case 'warn':
        logger.warn(msg, allProps);
        break;
      case 'error':
        logger.error(msg, allProps);
        break;
      case 'fatal':
        logger.fatal(msg, allProps);
        break;
    }
  }

  protected msg(msg: string, ...args: string[]): void {
    const level = this.entryLevel ?? 'trace';
    let formattedMsg = msg;
    for (const arg of args) {
      formattedMsg = formattedMsg.replace('%s', arg);
    }
    this._doLog(level, formattedMsg, {...this.entryCtx});
    this.entryCtx = {};
    this.entryLevel = null;
  }

  protected send(): void {
    const level = this.entryLevel ?? 'trace';
    this._doLog(level, '', {...this.entryCtx});
    this.entryCtx = {};
    this.entryLevel = null;
  }

  thread(thread: string | null | undefined): Logger {
    if (thread) {
      this._bindings.thread = thread;
    }
    return this;
  }

  pid(pid: number | null | undefined): Logger {
    if (pid) {
      this._bindings.pid = pid;
    }
    return this;
  }

  host(host: string | null | undefined): Logger {
    if (host) {
      this._bindings.host = host;
    }
    return this;
  }

  ip(ip: string | null | undefined): Logger {
    if (ip) {
      this._bindings.ip = ip;
    }
    return this;
  }

  cip(cip: string | null | undefined): Logger {
    if (cip) {
      this._bindings.cip = cip;
    }
    return this;
  }

  dtrace(dt: DistributedTraceContext | null | undefined): Logger {
    if (dt) {
      this._bindings.dt = dt;
    }
    return this;
  }

  rid(rid: string | null | undefined): Logger {
    if (rid) {
      this._bindings.rid = rid;
    }
    return this;
  }

  child(name: string): Logger {
    return new Logger(this.svc, name, {...this._bindings}, this._level);
  }

  isTrace(): boolean {
    return this._levelValue <= 10;
  }

  trace(): Entry {
    this.entryLevel = 'trace';
    this.entry.str('name', this.name);
    return this.entry;
  }

  isDebug(): boolean {
    return this._levelValue <= 20;
  }

  debug(): Entry {
    this.entryLevel = 'debug';
    this.entry.str('name', this.name);
    return this.entry;
  }

  isInfo(): boolean {
    return this._levelValue <= 30;
  }

  info(): Entry {
    this.entryLevel = 'info';
    this.entry.str('name', this.name);
    return this.entry;
  }

  isWarn(): boolean {
    return this._levelValue <= 40;
  }

  warn(): Entry {
    this.entryLevel = 'warn';
    this.entry.str('name', this.name);
    return this.entry;
  }

  isError(): boolean {
    return this._levelValue <= 50;
  }

  error(): Entry {
    this.entryLevel = 'error';
    this.entry.str('name', this.name);
    return this.entry;
  }

  isFatal(): boolean {
    return this._levelValue <= 60;
  }

  fatal(): Entry {
    this.entryLevel = 'fatal';
    this.entry.str('name', this.name);
    return this.entry;
  }

  isSilent(): boolean {
    return this._levelValue === Infinity;
  }

  silent(): Entry {
    this.entryLevel = 'silent';
    this.entry.str('name', this.name);
    return this.entry;
  }

  /**
   * Add context to the logger. Anything added here will be added to every log entry.
   * This does not override any context that was previously added to the logger or any parent logger.
   *
   * @param ctx the context to add
   */
  ctx(ctx: Context): Logger {
    Object.assign(this._bindings, ctx);
    return this;
  }

  /**
   * Returns the current logger context.
   */
  getCtx(): Context {
    return {...this._bindings};
  }

  /**
   * Overrides the log level for the logger.
   *
   * @param level the log level to set
   */
  level(level: LogLevel): Logger {
    this._level = level;
    this._levelValue = levelValues[level] ?? 30;
    return this;
  }

  /**
   * Returns the current log level.
   */
  getLevel(): LogLevel {
    return this._level;
  }
}

/**
 * Returns the default log level. If the LOGGING_LEVEL environment variable is set, it will be used.
 */
function getDefaultLogLevel(): LogLevel | undefined {
  if (typeof process === 'object') {
    const level = process.env.LOGGING_LEVEL;
    if (level && isLevel(level)) return level;
  }
  return undefined;
}

export type LogLevelFormat = 'numeric' | 'lowercase' | 'uppercase';

export type TimestampFormat = 'epoch' | 'iso' | 'unix';

/**
 * Options for logging initialization.
 */
export interface LoggingConfig {
  /**
   * The name of the service.
   */
  svc: string;

  /**
   * The name of the logger. If not provided 'root' is used.
   */
  name?: string;

  /**
   * The default log level. If not provided, the environment variable LOGGING_LEVEL is used and if not found 'info' is used.
   */
  level?: LogLevel;

  /**
   * The context to add to the logger.
   */
  ctx?: Context;

  /**
   * If true, the logger will be reinitialized even if it has already been initialized.
   */
  override?: boolean;

  /**
   * If true, the logger will include the process id in the log context. Default is false.
   */
  includePid?: boolean;

  /**
   * The ip address to include in the log context. Use the getIpAddress function to get the ip address.
   */
  ip?: string;

  /**
   * If true, the logger will include the name of the host in the log context. Default is false.
   */
  includeHost?: boolean;

  /**
   * The format to output the log level with. Default is "uppercase" following the standard.
   */
  logLevelFormat?: LogLevelFormat;

  /**
   * The format to output the timestamp with. Default is "epoch" following the standard.
   */
  timestampFormat?: TimestampFormat;

  /**
   * The timestamp label to use. Default is "time" following the standard.
   */
  timestampLabel?: string;
}

function createJsonSink(options: LoggingConfig): Sink {
  const tsLabel = options.timestampLabel ?? 'time';
  const levelFmt = options.logLevelFormat ?? 'uppercase';

  return (record: LogRecord): void => {
    const output: Record<string, unknown> = {};

    // Format level (logtape uses 'warning'; map it back to 'warn')
    const ourLevel: LogLevel =
      record.level === 'warning' ? 'warn' : (record.level as LogLevel);
    if (levelFmt === 'numeric') {
      output.level = levelValues[ourLevel];
    } else if (levelFmt === 'lowercase') {
      output.level = ourLevel;
    } else {
      output.level = ourLevel.toUpperCase();
    }

    // Format timestamp
    if (options.timestampFormat === 'unix') {
      output[tsLabel] = Math.round(record.timestamp / 1000);
    } else if (options.timestampFormat === 'iso') {
      output[tsLabel] = new Date(record.timestamp).toISOString();
    } else {
      output[tsLabel] = record.timestamp;
    }

    // Copy properties from record
    for (const [key, value] of Object.entries(record.properties)) {
      output[key] = value;
    }

    // Add svc from the logger category
    if (record.category.length > 0) {
      output.svc = record.category[0];
    }

    // Extract message
    const rawMsg =
      typeof record.rawMessage === 'string'
        ? record.rawMessage
        : record.rawMessage.join('');
    output.msg = rawMsg;

    process.stdout.write(JSON.stringify(output) + '\n');
  };
}

let root: Logger | undefined = undefined;

/**
 * Initializes the logger. This function should be called once at the beginning of the application.
 *
 * @param options the logging configuration
 */
export function initialize(options: LoggingConfig): Logger {
  if (root === undefined || options.override) {
    const initialBindings: Context = {};
    if (options.ip) {
      initialBindings.ip = options.ip;
    }
    if (options.includePid && typeof process !== 'undefined') {
      initialBindings.pid = process.pid;
    }
    if (options.includeHost) {
      try {
        initialBindings.host = os.hostname();
      } catch {
        // ignore if hostname() is unavailable
      }
    }
    if (options.ctx) {
      Object.assign(initialBindings, options.ctx);
    }

    configureSync({
      sinks: {
        stdout: createJsonSink(options),
      },
      loggers: [
        {
          category: [options.svc],
          sinks: ['stdout'],
          lowestLevel: 'trace',
        },
        {
          category: ['logtape', 'meta'],
          lowestLevel: null,
        },
      ],
      reset: true,
    });

    root = new Logger(
      options.svc,
      options.name ?? 'root',
      initialBindings,
      options.level ?? getDefaultLogLevel() ?? 'info',
    );
  }
  return root;
}

/**
 * Returns true if the logger has been initialized.
 */
export function isInitialized(): boolean {
  return root !== undefined;
}

/**
 * Shuts down the logger and unsets the root logger.
 */
export function shutdown() {
  root = undefined;
}

function getProxiedRootLogger(): Logger {
  return new Proxy(
    {},
    {
      get: function (target, prop) {
        if (
          typeof prop === 'string' &&
          [
            'trace',
            'debug',
            'info',
            'warn',
            'error',
            'fatal',
            'level',
            'thread',
            'pid',
            'host',
            'ip',
            'cip',
            'dtrace',
            'rid',
            'child',
          ].includes(prop)
        ) {
          return (...args: never[]) => {
            if (!root) throw new Error('Logger has not been initialized');
            const method = root[prop as keyof typeof root];
            if (typeof method === 'function') {
              // @ts-expect-error - TS doesn't like the bind call
              return method.bind(root)(...args);
            }
            throw new Error(`Property ${prop} is not a function`);
          };
        }
        return undefined;
      },
    },
  ) as Logger;
}

function createProxiedLogger(name?: string, log?: Logger): Logger {
  return new Proxy(
    {},
    {
      get: function (target, prop) {
        if (
          typeof prop === 'string' &&
          [
            'trace',
            'debug',
            'info',
            'warn',
            'error',
            'fatal',
            'level',
            'thread',
            'pid',
            'host',
            'ip',
            'cip',
            'dtrace',
            'rid',
            'child',
          ].includes(prop)
        ) {
          return (...args: never[]) => {
            if (!root) throw new Error('Logger has not been initialized');
            const realLogger = log
              ? new Logger(log.svc, name, {...log.getCtx()}, log.getLevel())
              : new Logger(root.svc, name, {...root.getCtx()}, root.getLevel());
            const method = realLogger[prop as keyof typeof realLogger];
            if (typeof method === 'function') {
              // @ts-expect-error - TS doesn't like the bind call
              return method.bind(realLogger)(...args);
            }
            throw new Error(`Property ${prop} is not a function`);
          };
        }
        return undefined;
      },
    },
  ) as Logger;
}

/**
 * Returns the root logger. If the logger has not been initialized, an error is thrown.
 */
export function getRootLogger(): Logger {
  if (root) return root;
  return getProxiedRootLogger();
}

/**
 * Returns a child logger from the root logger.
 *
 * @param name the name of the child logger
 */
export function newLogger(name: string): Logger {
  if (root) {
    return new Logger(root.svc, name, {...root.getCtx()}, root.getLevel());
  }
  return createProxiedLogger(name);
}
