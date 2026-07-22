class AppError extends Error {
  constructor(message, statusCode) {
    super(messsage);

    this.statusCode = statusCode;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
