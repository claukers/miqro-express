import { request, RequestOptions, RequestResponse, ResponseError } from "@miqro/core";
import { existsSync, unlinkSync } from "fs";
import { v4 } from "uuid";
import { App } from "./app";
import { createServer } from "http";
import { APIRouter, APIRouterOptions } from "./handler";
import { midleware } from "./middleware";

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

export const APITestHelper = async (options: APIRouterOptions, request: RequestOptions, cb?: (response: RequestResponse) => void): Promise<RequestResponse | void> => {
  const app = new App();
  app.use(midleware());
  app.use(APIRouter(options));
  return TestHelper(app, request, cb);
}
