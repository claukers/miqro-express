import { getLogger, Logger } from "@miqro/core";
import { getResults, NextCallback, NextHandler, setResults } from "./common";

export const JSONfyResultsHandler = (logger?: Logger): NextCallback => {
  if (!logger) {
    logger = getLogger("JSONfyResultsHandler");
  }
  return NextHandler(async (req, _res) => {
    const results = getResults(req);
    setResults(req, JSON.parse(JSON.stringify(results)) as any[]);
    return true;
  }, logger);
}

