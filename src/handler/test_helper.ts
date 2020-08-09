import {RequestOptions, RequestResponse, ResponseError, Util} from "@miqro/core";
import {existsSync, unlinkSync} from "fs";
import {Express} from "express";

export const TestHelper = async (app: Express, options: RequestOptions, cb?: (response: RequestResponse) => void, unixSocket = "/tmp/socket.12345"): Promise<RequestResponse | void> => {
  if (existsSync(unixSocket)) {
    unlinkSync(unixSocket);
  }
  const server = app.listen(unixSocket);
  return new Promise<RequestResponse | void>((resolve, reject) => {
    Util.request({
      url: options.url,
      headers: options.headers,
      socketPath: unixSocket,
      method: options.method
    }).then((response) => {
      server.close();
      if (cb) {
        cb(response);
      }
      resolve(response);
    }).catch((e: ResponseError) => {
      server.close();
      if (cb) {
        cb(e as any);
        resolve();
      } else {
        reject(e);
      }
    });
  });
}
