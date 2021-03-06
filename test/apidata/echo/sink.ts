import { FeatureHandler } from "@miqro/core";

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
  session: {
    authService: {
      verify: async ({ token }: { token: string; ctx: any }) => {
        if (token === "throw") {
          throw new Error("bla");
        }
        return token ? {
          account: "account",
          username: "username",
          groups: [],
          token
        } : null;
      }
    },
    options: {
      tokenLocation: "header",
      tokenLocationName: "Authorization"
    }
  },
  tag: true,
  jsonfy: true,
  handler: echo
};
