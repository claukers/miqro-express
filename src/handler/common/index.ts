export * from "./proxyutils";
import { Logger, Session, SimpleMap, getLogger, ParseOption, ParseOptionMap, ParseOptionsMode } from "@miqro/core";
import { IncomingHttpHeaders, IncomingMessage, OutgoingHttpHeaders, ServerResponse } from "http";
import { ParsedUrlQuery } from "querystring";
import { URL } from "url";
import { v4 } from "uuid";
import { parse as queryParse } from "querystring";
import EventEmitter from "events";
import { APIResponse, BadRequestResponse, ErrorResponse, ForbiddenResponse, NotFoundResponse, ServiceResponse, UnAuthorizedResponse } from "../../responses";

export interface AppHandler {
  handler: Handler | Handler[];
  method?: string;
  pathname?: string;
}

export const createServiceResponse = (ctx: Context): ServiceResponse | undefined => {
  if (!ctx.results || ctx.results.length === 0) {
    return undefined;
  }
  const response = ctx.results && ctx.results.length > 1 ? ctx.results : (
    ctx.results && ctx.results.length === 1 ? ctx.results[0] : undefined
  );
  return response !== undefined ? new ServiceResponse(response) : undefined;
};

export interface Response<T = any> {
  body?: T;
  status: number;
  headers: OutgoingHttpHeaders;
  send(ctx: Context): Promise<void>;
}

export class Context extends EventEmitter {
  public readonly pathname: string;
  public readonly url: string;
  public readonly hash: string;
  public readonly logger: Logger;
  public readonly method: string;
  public readonly startMS: number;
  public tookMS?: number;
  public readonly headers: IncomingHttpHeaders;
  public readonly cookies: SimpleMap<string>;
  public params: SimpleMap<string>;
  public query: ParsedUrlQuery;
  public buffer: Buffer;
  public body: Record<string, unknown>;
  public readonly uuid: string;
  public session?: Session;
  public results: any[];
  constructor(public req: IncomingMessage, public res: ServerResponse) {
    super({
      captureRejections: true
    });
    const url = new URL(`http://localhost${req.url}`);
    this.startMS = Date.now();
    this.uuid = v4();
    this.body = {}; // a middleware will fill this reading the buffer
    this.url = req.url as string;
    this.method = req.method as string;
    this.pathname = url.pathname;
    this.hash = url.hash;
    this.query = {
      ...queryParse(url.searchParams.toString())
    };
    this.params = {};
    this.cookies = {}; // a middleware will fill
    this.headers = req.headers;
    this.buffer = Buffer.from("");
    this.results = []; // handlers will fill this
    const identifier = `${this.method}:${this.url} ${this.uuid}(${this.req.socket.remoteAddress})`;
    this.logger = getLogger(identifier);
  }
}

export type Handler = (ctx: Context) => Promise<boolean | void | any>;

export interface ParseOptions {
  disableAsArray?: boolean;
  options: ParseOption[] | ParseOptionMap;
  mode?: ParseOptionsMode;
  ignoreUndefined?: boolean;
}

const NO_OPTIONS: ParseOptions = {
  options: [],
  mode: "no_extra"
};

export const getParseOption = (option?: ParseOptions | false): ParseOptions =>
  option ? option : (option === false ? NO_OPTIONS : {
    options: [],
    mode: "add_extra"
  });

export const createErrorResponse = (e: Error): APIResponse | null => {
  if (!e.name || e.name === "Error") {
    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
      return new ErrorResponse(`${e.message}. You are seeing this message because NODE_ENV === "development" || NODE_ENV === "test"`);
    } else {
      return null;
    }
  } else {
    switch (e.name) {
      case "MethodNotImplementedError":
        return new NotFoundResponse();
      case "ForbiddenError":
        return new ForbiddenResponse(e.message);
      case "UnAuthorizedError":
        return new UnAuthorizedResponse(e.message);
      case "ParseOptionsError":
      case "SequelizeValidationError":
      case "SequelizeEagerLoadingError":
      case "SequelizeUniqueConstraintError":
        return new BadRequestResponse(e.message);
      default:
        return new ErrorResponse(e);
    }
  }
};
