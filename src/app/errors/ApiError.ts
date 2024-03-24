class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string | undefined, stact = "") {
    super(message);
    this.statusCode = statusCode;
    if (stact) {
      this.stack = stact;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
