import { getLogger, Logger, Session, SimpleMap } from "@miqro/core";
import { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "http";
import { ParsedUrlQuery, parse as queryParse } from "querystring";
import { URL } from "url";
import { Response } from "./index";
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

export class Context {
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
  public clearCookie(name: string): void {
    this.setCookie(name, "", {
      path: "/",
      expires: new Date(Date.now())
    });
  }
  public setCookie(name: string, value: string, options?: CookieSerializeOptions): void {
    this.res.setHeader('Set-Cookie', cookieSerialize(name, String(value), options));
  }
  public async end({ status, headers, body }: Response): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.res.statusCode = status;
        const keys = Object.keys(headers);
        for (const key of keys) {
          if (headers[key] !== undefined) {
            this.res.setHeader(key, headers[key] as any);
          }
        }
        this.res.end(String(body), () => {
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  /* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
  public async json(body: any, status?: number): Promise<void> {
    return this.end({
      status: status !== undefined ? status : 200,
      headers: {
        ['Content-Type']: 'application/json; charset=utf-8'
      },
      body: JSON.stringify(body)
    })
  }
  public async text(text: string, status?: number): Promise<void> {
    return this.end({
      status: status !== undefined ? status : 200,
      headers: {
        ['Content-Type']: 'plain/text; charset=utf-8'
      },
      body: text
    });
  }
  public async html(html: string, status?: number): Promise<void> {
    return this.end({
      status: status !== undefined ? status : 200,
      headers: {
        ['Content-Type']: 'text/html; charset=utf-8'
      },
      body: html
    })
  }
  public async redirect(url: string): Promise<void> {
    return this.end({
      status: 302,
      headers: {
        ['Location']: url
      }
    })
  }
}
