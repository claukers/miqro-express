import { APIResponse } from "./api";

export class ServiceResponse extends APIResponse {
  /* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
  constructor(result: any) {
    super({
      success: !!result,
      result
    }, result ? 200 : 400);
  }
}
