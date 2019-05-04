import _ from 'lodash';
import pino from 'pino';
import serializeError from 'serialize-error';

const enableLogging = !process.env.DISABLE_LOGGER;

class Logger {
  public pinoInstance: pino.Logger;
  public context: { [key: string]: any };

  public constructor(options = {}) {
    const loggerOptions = {
      base: {
        environment: process.env.NODE_ENV,
        release: process.env.GIT_COMMIT_LONG,
      },
      level: process.env.LOGGER_LEVEL || 'trace',
      enabled: enableLogging,
      ...options,
    };
    this.pinoInstance = pino(loggerOptions);
    // default value for context
    this.context = {};
  }

  public setContext(context: {}) {
    this.context = context;
  }

  public trace(mergeObject: object, msg: string): void;
  public trace(msg: string): void;
  public trace(arg1: string | object, arg2?: string) {
    const [param1, param2] = this.mergeArgsWithContext(arg1, arg2);
    this.pinoInstance.trace(param1, param2);
  }

  public debug(mergeObject: object, msg: string): void;
  public debug(msg: string): void;
  public debug(arg1: string | object, arg2?: string) {
    const [param1, param2] = this.mergeArgsWithContext(arg1, arg2);
    this.pinoInstance.debug(param1, param2);
  }

  public info(mergeObject: object, msg: string): void;
  public info(msg: string): void;
  public info(arg1: string | object, arg2?: string) {
    const [param1, param2] = this.mergeArgsWithContext(arg1, arg2);
    this.pinoInstance.info(param1, param2);
  }

  public warn(mergeObject: object, msg: string): void;
  public warn(msg: string): void;
  public warn(arg1: string | object, arg2?: string) {
    const [param1, param2] = this.mergeArgsWithContext(arg1, arg2);
    this.pinoInstance.warn(param1, param2);
  }

  public error(mergeObject: object, msg: string): void;
  public error(msg: string): void;
  public error(arg1: string | object, arg2?: string) {
    const [param1, param2] = this.mergeArgsWithContext(arg1, arg2);
    this.pinoInstance.error(param1, param2);
  }

  public fatal(mergeObject: object, msg: string): void;
  public fatal(msg: string): void;
  public fatal(arg1: string | object, arg2?: string) {
    const [param1, param2] = this.mergeArgsWithContext(arg1, arg2);
    this.pinoInstance.fatal(param1, param2);
  }

  private mergeArgsWithContext(arg1: string | object, arg2?: string): [object, string | undefined] {
    let stringMsg: string | undefined;
    let mergeObject: { [key: string]: any } = { awsRequestId: this.context.awsRequestId };

    if (typeof arg1 === 'string') {
      stringMsg = arg1;
    } else if (_.isError(arg1)) {
      mergeObject = {
        ...mergeObject,
        error: serializeError(arg1),
      };
      stringMsg = arg2;
    } else if (_.isObject(arg1)) {
      mergeObject = {
        ...mergeObject,
        ...arg1,
      };
      mergeObject = _.mapValues(mergeObject, value =>
        _.isError(value) ? serializeError(value) : value,
      );
      stringMsg = arg2;
    }

    return [mergeObject, stringMsg];
  }
}

let loggerInstance: Logger | undefined;
export function getLoggerInstance(options = {}) {
  if (!loggerInstance) loggerInstance = new Logger(options);
  return loggerInstance;
}

export { getLoggerInstance as instance };
