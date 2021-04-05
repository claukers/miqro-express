import { ParseOption, ParseOptionMap, ParseOptionsError, ParseOptionsMode } from "@miqro/core";

export * from "./proxyutils";
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
