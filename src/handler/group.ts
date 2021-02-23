import {
  ForbiddenError,
  GroupPolicy,
  GroupPolicyValidator,
  ParseOptionsError,
  UnAuthorizedError
} from "@miqro/core";
import { Context, Handler } from "./common";

export const GroupPolicyHandler = (options: GroupPolicy): Handler => {
  return async (ctx: Context) => {
    try {
      if (!ctx.session) {
        throw new ParseOptionsError(`No Session!`);
      } else {
        const result = await GroupPolicyValidator.validate(ctx.session, options, ctx.logger);
        if (result) {
          ctx.logger.debug(`groups [${ctx && ctx.session && ctx.session.groups ? ctx.session.groups.join(",") : ""}] validated!`);
          return true;
        } else {
          ctx.logger.warn(`groups [${ctx && ctx.session && ctx.session.groups ? ctx.session.groups.join(",") : ""}] fail to validate!`);
          throw new UnAuthorizedError(`Invalid session. You are not permitted to do this!`);
        }
      }
    } catch (e) {
      //(logger as Logger).warn(`request[${req.uuid}] message[${e.message}] stack[${e.stack}]`);
      if (e.name && e.name !== "Error") {
        throw e;
      } else {
        throw new ForbiddenError(`Invalid session. You are not permitted to do this!`);
      }
    }
  };
};
