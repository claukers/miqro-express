import { APIResponse } from "./api";

export class NotFoundResponse extends APIResponse {
  constructor() {
    super({
      success: false,
      message: "not found"
    });
    this.status = 404;
  }
}
