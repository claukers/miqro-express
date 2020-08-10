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
      ...options,
      socketPath: unixSocket
    }).then((response) => {
      server.close();
      if (cb) {
        try {
          cb(response);
        } catch (ee) {
          reject(ee);
        }
      }
      resolve(response);
    }).catch((e: ResponseError) => {
      server.close();
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
}
