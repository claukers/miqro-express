import { Handler, FeatureToggle, LoggerHandler, ReadBuffer, JSONParser, URLEncodedParser, TextParser } from "@miqro/core";
import { CookieParser } from "./cookie";
import { TagResponse } from "./tag";
import { UUIDHandler } from "./uuid";
// import { CORSHandler } from "./cors";

export * from "./tag";
export * from "./cookie";
export * from "./uuid";
// export * from "./cors";

export const middleware = (): Handler[] => {
  const ret: Handler[] = [];
  if (FeatureToggle.isFeatureEnabled("UUID", true)) {
    ret.push(UUIDHandler());
  }
  if (FeatureToggle.isFeatureEnabled("REQUEST_LOGGER", true)) {
    ret.push(LoggerHandler());
  }
  if (FeatureToggle.isFeatureEnabled("TAG_RESPONSE", false)) {
    ret.push(TagResponse());
  }
  /*if (FeatureToggle.isFeatureEnabled("CORS", true)) {
    ret.push(CORSHandler());
  }*/
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
