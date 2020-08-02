import {RequestOptions, ResponseError, Util} from "@miqro/core";
import {existsSync, unlinkSync} from "fs";
import {Express} from "express";

export const TestHelper = (app: Express, options: RequestOptions, cb: (args: { status: number; data: any; headers: any; }) => void, unixSocket = "/tmp/socket.12345"): void => {
  if (existsSync(unixSocket)) {
    unlinkSync(unixSocket);
  }
  const server = app.listen(unixSocket);
  Util.request({
    url: options.url,
    headers: options.headers,
    socketPath: unixSocket,
    method: options.method
  }).then(({status, data, headers}) => {
    server.close();
    cb({status, data, headers});
  }).catch((e: ResponseError) => {
    server.close();
    const {status, data, headers} = e as any;
    cb({status, data, headers});
  });
}
