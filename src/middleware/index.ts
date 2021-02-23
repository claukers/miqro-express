import { FeatureToggle } from "@miqro/core";
import { Handler, ErrorHandler } from "../handler";
import { ReadBufferHandler } from "./buffer";
import { CookieParserHandler } from "./cookie";
import { URLEncodedBodyParserHandler } from "./form";
import { JSONBodyParserHandler } from "./json";
import { LoggerHandler } from "./logger";
import { UUIDHandler } from "./uuid";

export * from "./uuid";
export * from "./logger";
export * from "./json";
export * from "./form";
export * from "./cookie";
export * from "./buffer";

export const setup = (): Handler[] => {
  const ret: Handler[] = [];
  if (FeatureToggle.isFeatureEnabled("REQUEST_UUID", true)) {
    ret.push(UUIDHandler());
  }
  if (FeatureToggle.isFeatureEnabled("MORGAN", true)) {
    ret.push(LoggerHandler());
  }
  if (FeatureToggle.isFeatureEnabled("ERROR_HANDLER", true)) {
    ret.push(ErrorHandler());
  }
  if (FeatureToggle.isFeatureEnabled("READ_BUFFER", true)) {
    ret.push(ReadBufferHandler);
  }
  if (FeatureToggle.isFeatureEnabled("COOKIE_PARSER", true)) {
    ret.push(CookieParserHandler);
  }
  if (FeatureToggle.isFeatureEnabled("BODY_PARSER", true)) {
    ret.push(JSONBodyParserHandler());
  }
  if (FeatureToggle.isFeatureEnabled("BODY_PARSER_URL_ENCODED", true)) {
    ret.push(URLEncodedBodyParserHandler());
  }
  return ret;
};
