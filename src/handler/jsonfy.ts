import { getResults, NextCallback, NextHandler, setResults } from "./common";

export const JSONfyResultsHandler = (): NextCallback =>
  NextHandler(async (req, _res) => {
    const results = getResults(req);
    setResults(req, JSON.parse(JSON.stringify(results)) as any[]);
    return true;
  });
