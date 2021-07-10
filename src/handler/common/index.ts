import { ParseOption, ParseOptionMap, ParseOptionsMode } from "@miqro/core";

export interface ParseOptions {
  description?: string;
  options: ParseOption[] | ParseOptionMap;
  mode?: ParseOptionsMode;
  ignoreUndefined?: boolean;
}

const NO_OPTIONS: ParseOptions[] = [{
  options: [],
  mode: "no_extra"
}];

const ADD_EXTRA: ParseOptions[] = [{
  options: [],
  mode: "add_extra"
}];

export const normalizeParseOptions = (option?: ParseOptions | false | ParseOptions[]): ParseOptions[] =>
  option ? (option instanceof Array ? option : [option]) : (option === false ? NO_OPTIONS : ADD_EXTRA);
