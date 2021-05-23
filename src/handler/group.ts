import {
  ForbiddenError,
  GroupPolicy,
  GroupPolicyValidator,
  ParseOptionsError,
  UnAuthorizedError,
  Context, Handler
} from "@miqro/core";

export const GroupPolicyHandler = (options: GroupPolicy): Handler<void> => {
  return async (ctx: Context): Promise<void> => {
    try {
      if (!ctx.session) {
        throw new ParseOptionsError(`No Session!`);
      } else {
        const result = await GroupPolicyValidator.validate(ctx.session, options, ctx.logger);
        if (result) {
          ctx.logger.debug("groups validated!");
        } else {
          ctx.logger.error("%sgroups fail to validate!", ctx && ctx.session && ctx.session.groups ? `[${ctx.session.groups.join(",")}] ` : "");
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
