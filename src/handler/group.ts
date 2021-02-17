import {
  ForbiddenError,
  GroupPolicy,
  GroupPolicyValidator,
  Logger,
  ParseOptionsError,
  UnAuthorizedError,
  Util
} from "@miqro/core";
import {AsyncNextCallback} from "./common";

export const GroupPolicyHandler = (options: GroupPolicy, logger?: Logger): AsyncNextCallback => {
  if (!logger) {
    logger = Util.getLogger("GroupPolicyHandler");
  }
  return async (req, _res, next) => {
    try {
      if (!req.session) {
        next(new ParseOptionsError(`No Session!`));
      } else {
        const result = await GroupPolicyValidator.validate(req.session, options, logger as Logger);
        if (result) {
          (logger as Logger).debug(`request[${req.uuid}] ` +
            `groups [${req && req.session && req.session.groups ? req.session.groups.join(",") : ""}] validated!`);

          next();
        } else {
          (logger as Logger).warn(`request[${req.uuid}] ` +
            `groups [${req && req.session && req.session.groups ? req.session.groups.join(",") : ""}] fail to validate!`);

          next(new UnAuthorizedError(`Invalid session. You are not permitted to do this!`));
        }
      }
    } catch (e) {
      //(logger as Logger).warn(`request[${req.uuid}] message[${e.message}] stack[${e.stack}]`);
      if (e.name && e.name !== "Error") {
        next(e);
      } else {
        next(new ForbiddenError(`Invalid session. You are not permitted to do this!`));
      }
    }
  };
};
