import { Handler, FeatureToggle } from "@miqro/core";
import { ReadBuffer } from "./buffer";
import { CookieParser } from "./cookie";
import { URLEncodedParser } from "./form";
import { JSONParser } from "./json";
import { TextParser } from "./text";
import { LoggerHandler } from "./logger";
import { UUIDHandler } from "./uuid";

export * from "./logger";
export * from "./json";
export * from "./text";
export * from "./form";
export * from "./cookie";
export * from "./uuid";
export * from "./buffer";

export const middleware = (): Handler[] => {
  const ret: Handler[] = [];
  if (FeatureToggle.isFeatureEnabled("UUID", true)) {
    ret.push(UUIDHandler());
  }
  if (FeatureToggle.isFeatureEnabled("REQUEST_LOGGER", true)) {
    ret.push(LoggerHandler());
  }
  if (FeatureToggle.isFeatureEnabled("READ_BUFFER", true)) {
    ret.push(ReadBuffer());
  }
  if (FeatureToggle.isFeatureEnabled("COOKIE_PARSER", true)) {
    ret.push(CookieParser());
  }
  if (FeatureToggle.isFeatureEnabled("JSON_PARSER", true)) {
    ret.push(JSONParser());
  }
  if (FeatureToggle.isFeatureEnabled("URL_ENCODED_PARSER", true)) {
    ret.push(URLEncodedParser());
  }
  if (FeatureToggle.isFeatureEnabled("TEXT_PARSER", true)) {
    ret.push(TextParser());
  }
  return ret;
};
