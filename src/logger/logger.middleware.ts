import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MyLogger } from './logger.service';
import { finished } from 'stream';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private myLogger: MyLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, body, query, protocol, hostname, originalUrl } = req;

    const oldWrite = res.write,
      oldEnd = res.end;

    const chunks: Buffer[] = [];

    const pushChunk = (chunk: any) => {
      if (!chunk) return;

      if (Buffer.isBuffer(chunk)) {
        chunks.push(chunk);
      } else if (typeof chunk === 'string') {
        chunks.push(Buffer.from(chunk));
      } else if (chunk instanceof Uint8Array) {
        chunks.push(Buffer.from(chunk));
      }
    };

    let respBody;

    res.write = function (chunk, ...rest) {
      pushChunk(chunk);

      return oldWrite.call(res, chunk, ...rest);
    };

    res.end = function (chunk, ...rest) {
      if (chunk && typeof chunk !== 'function') {
        pushChunk(chunk);
      }

      respBody = Buffer.concat(chunks).toString('utf8');

      return oldEnd.call(res, chunk, ...rest);
    };

    finished(res, () => {
      const { statusCode } = res;
      this.myLogger.log(
        `
          Request method: ${method}, Response status: ${statusCode};
          Request url:  ${protocol}://${hostname}${originalUrl};
          Request body: ${JSON.stringify(body)};
          Responce body: ${respBody};
          Query params: ${JSON.stringify(query)};`,
      );
    });

    next();
  }
}
