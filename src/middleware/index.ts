import { FeatureToggle } from "@miqro/core";
import { Handler } from "../handler";
import { ReadBuffer } from "./buffer";
import { CookieParser } from "./cookie";
import { URLEncodedParser } from "./form";
import { JSONParser } from "./json";
import { Logger } from "./logger";

export * from "./logger";
export * from "./json";
export * from "./form";
export * from "./cookie";
export * from "./buffer";

export const midleware = (): Handler[] => {
  const ret: Handler[] = [];
  if (FeatureToggle.isFeatureEnabled("REQUEST_LOGGER", true)) {
    ret.push(Logger());
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
  return ret;
};
