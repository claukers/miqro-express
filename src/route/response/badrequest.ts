import { APIResponse } from "./api";

export class BadRequestResponse extends APIResponse {
  constructor(message: string) {
    super({
      success: false,
      message
    });
    this.status = 400;
  }
}
