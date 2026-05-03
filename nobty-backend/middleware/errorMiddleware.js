const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`Route not found - ${req.originalUrl}`);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    error: err.message || "Internal server error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};