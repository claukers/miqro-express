import { APIRoute, FeatureHandler, ResponseHandler } from "../../src/handler";

const hello: FeatureHandler = [
  async (ctx) => {
    ctx.results.push({
      message: "custom"
    });
    return true;
  },
  ResponseHandler()
];

module.exports = {
  path: "/",
  methods: ["delete", "put"],
  name: "mycustom",
  handler: hello
} as APIRoute;
