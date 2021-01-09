import {FeatureHandler, Handler, NextCallback, ResponseHandler} from "../../../src/handler";
import {Logger} from "@miqro/core";

const echo: FeatureHandler = (logger: Logger): NextCallback[] | NextCallback => {
  return [
    Handler(async (req) => {
      logger.info(req.body);
      return req.params.param1 ? req.params.param1 : req.body;
    }, logger),
    ResponseHandler(logger)
  ];
}

module.exports = {
  path: "/bbb/:param1?",
  methods: ["put"],
  params: {
    options: [
      {name: "param1", required: false, type: "number"}
    ],
    mode: "no_extra"
  },
  body: {
    options: [
      {name: "bla", required: true, type: "string"}
    ],
    mode: "no_extra"
  },
  query: {
    options: [
      {name: "bla", required: true, type: "string"}
    ],
    mode: "no_extra"
  },
  handler: echo
};
