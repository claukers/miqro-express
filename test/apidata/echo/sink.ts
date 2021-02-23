import { FeatureHandler } from "../../../src/handler";

const echo: FeatureHandler = [
  async (ctx) => {
    ctx.logger.info(ctx.body);
    ctx.logger.info(ctx.params);
    const ret = ctx.params.param1 ? { bla: ctx.params.param1.toString() } : ctx.body;
    ctx.logger.info(ret);
    ctx.results.push(ret);
    return true;
  }
];

module.exports = {
  path: "/bbb/:param1?",
  methods: ["put"],
  params: {
    options: [
      { name: "param1", required: false, type: "number" }
    ],
    mode: "no_extra"
  },
  body: {
    options: [
      { name: "bla", required: true, type: "string" }
    ],
    mode: "no_extra"
  },
  query: {
    options: [
      { name: "bla", required: true, type: "string" }
    ],
    mode: "no_extra"
  },
  results: {
    options: [
      { name: "bla", required: true, type: "string" }
    ],
    mode: "no_extra"
  },
  tag: true,
  jsonfy: true,
  handler: echo
};
