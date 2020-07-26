import { APIResponse } from "./api";

export class ErrorResponse extends APIResponse {
  constructor(e: Error) {
    super({
      success: false,
      message: e.message
    });
    this.status = 503;
  }
}
