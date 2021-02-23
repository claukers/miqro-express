import { Logger, RequestOptions, RequestResponse, ResponseError, Util } from "@miqro/core";
import { existsSync, unlinkSync } from "fs";
import express, { Express } from "express";
import { setupMiddleware } from "../middleware";
import { APIRouter, APIRouterOptions } from "./api-router";
import { ErrorHandler } from "./response";
import { v4 } from "uuid";

export const TestHelper = async (app: Express, options: RequestOptions, cb?: (response: RequestResponse) => void): Promise<RequestResponse | void> => {
  const unixSocket = `/tmp/socket.${v4()}`;
  if (existsSync(unixSocket)) {
    unlinkSync(unixSocket);
  }
  const server = app.listen(unixSocket);
  return new Promise<RequestResponse | void>((resolve, reject) => {
    Util.request({
      ...options,
      socketPath: unixSocket
    }).then((response) => {
      server.close(() => {
        if (cb) {
          try {
            cb(response);
          } catch (ee) {
            reject(ee);
          }
        }
        resolve(response);
      });
    }).catch((e: ResponseError) => {
      server.close(() => {
        if (cb) {
          try {
            cb(e as any);
          } catch (ee) {
            reject(ee);
          }
          resolve();
        } else {
          reject(e);
        }
      });
    });
  });
}

export const APITestHelper = async (api: APIRouterOptions, options: RequestOptions, cb?: (response: RequestResponse) => void, logger?: Logger): Promise<RequestResponse | void> => {
  const app = express();
  await setupMiddleware(app, logger);
  app.use(APIRouter(api, logger));
  app.use(ErrorHandler(undefined, logger));
  return TestHelper(app, options, cb);
}
