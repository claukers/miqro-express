import { getLogger, Logger, Session, SimpleMap } from "@miqro/core";
import EventEmitter from "events";
import { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "http";
import { ParsedUrlQuery, parse as queryParse } from "querystring";
import { URL } from "url";
import { serialize as cookieSerialize, CookieSerializeOptions } from "cookie";
import { v4 } from "uuid";

// adds "/" to the final of path 
// cannot account for query or hash params so send only new URL().pathname 
export const normalizePath = (path: string): string => {
  if (typeof path !== "string") {
    throw new Error("path not string");
  }
  if (path.length > 1) {
    if (path.charAt(0) !== "/") {
      throw new Error("path doesnt start with /");
    }
    if (path[path.length - 1] !== "/") {
      return `${path}/`;
    } else {
      return path; // already normalized
    }
  } else if (path !== "/") {
    throw new Error("path of length 1 not /");
  } else {
    return path; // "/"
  }
}

export class Context extends EventEmitter {
  public readonly logger: Logger;
  public readonly startMS: number;
  public tookMS?: number;
  public readonly uuid: string;
  public session?: Session;
  public results: any[];
  public readonly path: string;
  public readonly url: string;
  public readonly hash: string;
  public readonly method: string;
  public readonly headers: IncomingHttpHeaders;
  public readonly cookies: SimpleMap<string>;
  public query: ParsedUrlQuery;
  public buffer: Buffer; // empty buffer. middleware must read it
  public readonly remoteAddress?: string;
  public body: any; // a middleware will fill this reading the buffer
  constructor(public readonly req: IncomingMessage, public readonly res: ServerResponse) {
    super({
      captureRejections: true
    });
    this.body = undefined as any;
    const url = new URL(`http://localhost${req.url}`);
    this.url = req.url as string;
    this.method = req.method as string;
    this.path = normalizePath(url.pathname);
    this.hash = url.hash;
    this.query = {
      ...queryParse(url.searchParams.toString())
    };
    this.buffer = Buffer.from("");
    this.remoteAddress = req.socket.remoteAddress;
    this.cookies = {}; // a middleware will fill
    this.headers = req.headers;
    this.startMS = Date.now();
    this.uuid = v4();
    this.results = []; // handlers will fill this
    const identifier = `${this.method}:${this.url} ${this.uuid}(${this.remoteAddress})`;
    this.logger = getLogger(identifier);
  }
  setCookie(name: string, value: string, options?: CookieSerializeOptions) {
    this.res.setHeader('Set-Cookie', cookieSerialize(name, String(value), options));
  }
}
