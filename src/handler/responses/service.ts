import {APIResponse} from "./api";

export class ServiceResponse extends APIResponse {
  /* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
  constructor(result: any) {
    super({
      success: !!result,
      result
    });
    if (!result) {
      this.status = 400;
    }
  }
}
