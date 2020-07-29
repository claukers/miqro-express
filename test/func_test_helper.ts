import {Express} from "express";
import {ResponseError, Util} from "@miqro/core";
import {existsSync, unlinkSync} from "fs";

const SOCKET_PATH = "/tmp/socket.1231";
if (existsSync(SOCKET_PATH)) {
  unlinkSync(SOCKET_PATH);
}

export const fake = (cb: (...args: any[]) => any) => {

  const ret = (...args: any[]) => {
    ret.callCount++;
    return cb(...args);
  };
  ret.callCount = 0;
  return ret;
}

export const FuncTestHelper = (options: { url: string, method: string; app: Express; headers?: any; }, cb: (args: { status: number; data: any; headers: any; }) => void) => {
  const server = options.app.listen(SOCKET_PATH);
  Util.request({
    url: options.url,
    headers: options.headers,
    socketPath: SOCKET_PATH,
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
