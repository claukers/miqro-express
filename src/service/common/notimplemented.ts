export class MethodNotImplementedError extends Error {
  public isMethodNotImplementedError = true;
  constructor(method: string) {
    super(`method ${method} not implemented!`);
  }
}
