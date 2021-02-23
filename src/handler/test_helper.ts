import { Logger, request, RequestOptions, RequestResponse, ResponseError, Util } from "@miqro/core";
import { existsSync, unlinkSync } from "fs";
import { setup } from "../middleware";
import { APIRouter, APIRouterOptions } from "./api-router";
import { ErrorHandler } from "./error";
import { v4 } from "uuid";
import { App } from "./router";
import { createServer } from "http";

export const TestHelper = async (app: App, options: RequestOptions, cb?: (response: RequestResponse) => void): Promise<RequestResponse | void> => {
  const unixSocket = `/tmp/socket.${v4()}`;
  if (existsSync(unixSocket)) {
    unlinkSync(unixSocket);
  }
  const server = createServer(app.listener);
  return new Promise<RequestResponse | void>((resolve, reject) => {
    server.listen(unixSocket, () => {
      request({
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
  });
}

export const APITestHelper = async (api: APIRouterOptions, options: RequestOptions, cb?: (response: RequestResponse) => void, logger?: Logger): Promise<RequestResponse | void> => {
  const app = new App();
  app.add(setup());
  app.add(APIRouter(api, logger));
  return TestHelper(app, options, cb);
}
