const errorHandler = (err, req, res, next) => {
  console.log("ERROR =>", err);
  err.statusCode = err.statusCode || 500;

  err.message = err.message || "Server Error";

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default errorHandler;
