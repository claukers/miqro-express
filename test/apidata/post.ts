import { FeatureHandler, ResponseHandler } from "../../src/handler";

const hello: FeatureHandler = [
  async (ctx) => {
    /*return new Promise<boolean>((resolve)=>{
      resolve(true);
      ctx.results.push({
        message: "hello"
      });
      ctx.res.end("asd", ()=>{
        
      });
    });*/
    ctx.results.push({
      message: "hello"
    });
    return true;
  },
  ResponseHandler()
]

module.exports = {
  path: "/",
  handler: hello
};
