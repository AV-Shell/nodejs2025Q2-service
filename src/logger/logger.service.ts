import { LoggerService, Injectable, LogLevel } from '@nestjs/common';
import { stat, writeFile, rename } from 'node:fs/promises';
import { mkdirSync } from 'node:fs';
import * as path from 'path';
import { isEmpty } from 'lodash';

@Injectable()
export class MyLogger implements LoggerService {
  private readonly currentLogLevel: number;
  private readonly logfilesize: number;
  private readonly logsDirectory: string;
  private readonly isDirectoryOk: boolean;

  constructor() {
    console.log('process.env.LOG_LEVEL', process.env.LOG_LEVEL);
    this.currentLogLevel = +(process.env.LOG_LEVEL ?? 0);
    this.logfilesize = +(process.env.LOG_FILE_SIZE ?? 10) * 1024;

    this.logsDirectory = path.join(`./logs/`);
    try {
      mkdirSync(this.logsDirectory, { recursive: true });
      this.isDirectoryOk = true;
    } catch (error) {
      console.log(`Something wrong with logs directory ${this.logsDirectory}`);
      console.log(error);
      this.isDirectoryOk = true;
    }
  }
  /**
   * Write a 'log' level log.
   */
  log(data: any, ...optionalParams: any[]) {
    this.logging('log', data, optionalParams);
  }

  /**
   * Write an 'error' level log.
   */
  error(data: any, ...optionalParams: any[]) {
    this.logging('error', data, optionalParams);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(data: any, ...optionalParams: any[]) {
    this.logging('warn', data, optionalParams);
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(data: any, ...optionalParams: any[]) {
    this.logging('debug', data, optionalParams);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(data: any, ...optionalParams: any[]) {
    this.logging('verbose', data, optionalParams);
  }

  private async logging(level: LogLevel, data, optionalParams: any[]) {
    let logLevel = 0;
    let color = '\x1b[37m';
    switch (level) {
      case 'error':
        logLevel = 1;
        color = '\x1b[31m';
        break;
      case 'warn':
        logLevel = 2;
        color = '\x1b[33m';
        break;
      case 'log':
        logLevel = 3;
        color = '\x1b[32m';
        break;
      case 'verbose':
        logLevel = 4;
        color = '\x1b[36m';
        break;
      case 'debug':
        logLevel = 5;
        color = '\x1b[37m';
        break;

      default:
        break;
    }

    if (logLevel > this.currentLogLevel) {
      return;
    }

    const optionalRest = isEmpty(optionalParams)
      ? ''
      : '\n' + optionalParams.map(this.transformLogData).join('; ');

    const logMessage = '\n' + this.transformLogData(data);

    console.log(`${color}${logMessage + optionalRest}\x1b[0m`);
    if (this.isDirectoryOk) {
      await this.logToFile(false, logMessage + optionalRest);
    }

    if (level === 'error' && this.isDirectoryOk) {
      await this.logToFile(true, logMessage + optionalRest);
    }
  }

  private async logToFile(isError: boolean, message: string) {
    const filename = isError ? 'errors.log' : 'logs.log';
    const filenameWithoutExtension = isError ? 'errors' : 'logs';
    const pathToFile = path.join(this.logsDirectory, filename);
    let stats;
    let isFile = false;
    try {
      stats = await stat(pathToFile);
      isFile = stats.isFile();

      if (!isFile || stats.size > this.logfilesize) {
        await rename(
          pathToFile,
          path.join(`./logs/${filenameWithoutExtension}-${Date.now()}.log`),
        );
      }
    } catch (error) {}
    try {
      await writeFile(pathToFile, message, { flag: 'a' });
    } catch (error) {}
  }

  private transformLogData = (data) => {
    if (typeof data === 'string') {
      return data;
    } else if (data instanceof Error) {
      return JSON.stringify(
        { message: data.message, stack: data.stack },
        null,
        4,
      );
    }
    return JSON.stringify(data, null, 4);
  };
}
