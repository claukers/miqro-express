import { FeatureToggle } from "@miqro/core";
import { Handler } from "../handler";
import { ReadBuffer } from "./buffer";
import { CookieParser } from "./cookie";
import { URLEncodedBodyParser } from "./form";
import { JSONBodyParser } from "./json";
import { Logger } from "./logger";

export * from "./logger";
export * from "./json";
export * from "./form";
export * from "./cookie";
export * from "./buffer";

export const midleware = (): Handler[] => {
  const ret: Handler[] = [];
  if (FeatureToggle.isFeatureEnabled("MORGAN", true)) {
    ret.push(Logger());
  }
  if (FeatureToggle.isFeatureEnabled("READ_BUFFER", true)) {
    ret.push(ReadBuffer());
  }
  if (FeatureToggle.isFeatureEnabled("COOKIE_PARSER", true)) {
    ret.push(CookieParser());
  }
  if (FeatureToggle.isFeatureEnabled("BODY_PARSER", true)) {
    ret.push(JSONBodyParser());
  }
  if (FeatureToggle.isFeatureEnabled("BODY_PARSER_URL_ENCODED", true)) {
    ret.push(URLEncodedBodyParser());
  }
  return ret;
};
