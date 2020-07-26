import { APIResponse } from "./api";

export class UnAuthorizedResponse extends APIResponse {
  constructor(message: string) {
    super({
      success: false,
      message
    });
    this.status = 401;
  }
}
