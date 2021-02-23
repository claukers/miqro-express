export * from "./proxyutils";
import { inspect } from "util";
import { Logger, Session, SimpleMap, parseOptions, getLogger } from "@miqro/core";
import { BasicParseOptions } from "../parse";
import { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "http";
import { ParsedUrlQuery } from "querystring";
import { URL } from "url";
import { v4 } from "uuid";
import { parse as queryParse } from "querystring";
import EventEmitter from "events";

export class Context extends EventEmitter {
  public pathname: string;
  public url: string;
  public hash: string;
  public logger: Logger;
  public method: string;
  public headers: IncomingHttpHeaders;
  public cookies: SimpleMap<string>;
  public params: SimpleMap<string>;
  public query: ParsedUrlQuery;
  public buffer: Buffer;
  public body: object;
  public uuid: string;
  public session?: Session;
  public results: any[];
  constructor(public req: IncomingMessage, public res: ServerResponse) {
    super({
      captureRejections: true
    });
    const url = new URL(`http://localhost${req.url}`);
    this.uuid = v4();
    this.body = {}; // a middleware will fill this reading the buffer
    this.url = req.url as string;
    this.method = req.method as string;
    this.pathname = url.pathname;
    this.hash = url.hash;
    this.query = queryParse(url.search);
    this.params = {};
    this.cookies = {};
    this.headers = req.headers;
    this.buffer = Buffer.from("");
    this.results = [];
    const identifier = `${this.method}:${this.url} ${this.uuid}(${this.req.socket.remoteAddress})`;
    this.logger = getLogger(identifier);
  }
}

export type Handler = (ctx: Context) => Promise<boolean | void>;
