import { APIResponse } from "./api";

export class ForbidenResponse extends APIResponse {
  constructor(message: string) {
    super({
      success: false,
      message
    });
    this.status = 403;
  }
}
