import { APIResponse } from "./api";

export class ServiceResponse extends APIResponse {
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
