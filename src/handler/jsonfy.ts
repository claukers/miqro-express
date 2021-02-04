import { getResults, NextHandler, setResults } from "./common";

export const JSONfyResultsHandler = () =>
  NextHandler(async (req, res, next) => {
    const results = getResults(req);
    setResults(req, JSON.parse(JSON.stringify(results)) as any[]);
    next();
  });
