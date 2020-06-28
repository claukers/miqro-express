import {getResults, INextHandlerCallback} from "./handlerutils";
import {Handler} from "./handler";
import {Logger} from "@miqro/core";

export interface HandleAllOptionsOutput {
  req: any,
  handlers: INextHandlerCallback[]
}

export type HandleAllOptions = (req: any) => Promise<HandleAllOptionsOutput[]>;

export const HandleAll = (generator: HandleAllOptions, logger?: Logger): INextHandlerCallback => {
  return Handler(async (req: any) => {
    return Promise.all((await generator(req)).map((call) => {
      return new Promise((resolve, reject) => {
        const toCall = call.handlers.reverse();
        const nextCaller = () => {
          const handler = toCall.pop();
          if (!handler) {
            resolve(getResults(call.req))
          } else {
            handler(call.req, null, (e?: Error) => {
              if (e) {
                reject(e);
              } else {
                setTimeout(nextCaller, 0);
              }
            });
          }
        };
        setTimeout(nextCaller, 0);
      })
    }));
  }, logger);
};
