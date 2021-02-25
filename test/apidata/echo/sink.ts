import { FeatureHandler } from "../../../src/handler";

const echo: FeatureHandler = [
  async (ctx) => {
    ctx.logger.info(ctx.body);
    ctx.logger.info(ctx.query);
    const ret = ctx.body;
    ctx.logger.info(ret);
    return ret;
  }
];

module.exports = {
  path: "/bbb/",
  methods: ["put"],
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
