const errorHandler = (err, req, res, next) => {
  console.log("ERROR =>", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Server Error";

  // Invalid MongoDB ObjectId (e.g. /api/vehicles/invalid-id)
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
