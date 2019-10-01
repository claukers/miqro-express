import { ISession, ParseOptionsError, Util } from "miqro-core";

export type IGroupPolicy = "at_leats_one" | "all";

export interface IGroupPolicyOptions {
  groups: string[];
  groupPolicy: IGroupPolicy;
  name?: string;
}

export abstract class GroupPolicy {
  public static async validateSession(session: ISession, options: IGroupPolicyOptions) {
    const logger = Util.getLogger(`${options.name}${options.name ? "::" : ""}GroupPolicy`);
    if (!session || !session.account || !session.username) {
      throw new ParseOptionsError(`Invalid authentication!`);
    }
    let ret = false;
    switch (options.groupPolicy) {
      case "at_leats_one":
        ret = false;
        for (const group of session.groups) {
          if (options.groups.indexOf(group) !== -1) {
            ret = true;
            break;
          }
        }
        break;
      case "all":
        ret = true;
        for (const group of options.groups) {
          if (session.groups.indexOf(group) === -1) {
            ret = false;
            break;
          }
        }
        break;
      default:
        logger.error(`policy [${options.groupPolicy}] not implemented!!`);
        throw new ParseOptionsError(`policy not implemented!`);
    }
    if (!ret) {
      logger.warn(`unauthorized token[${session.token}] with groups[${session.groups.toString()}]` +
        ` not on correct groups [${options.groups.toString()}] with policy [${options.groupPolicy}]`);
      throw new ParseOptionsError(`Not on the correct groups!`);
    } else {
      logger.debug(`authorized token[${session.token}] with groups[${session.groups.toString()}]` +
        ` on correct groups [${options.groups.toString()}] with policy [${options.groupPolicy}]`);
    }
  }
}
