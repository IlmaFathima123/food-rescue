export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  console.error(err);

  if (err?.name === "CastError") {
    return res.status(404).json({ message: "Resource not found" });
  }

  const status = err.status || 500;
  const body = { message: err.message || "Internal server error" };
  if (err.fieldErrors) body.fieldErrors = err.fieldErrors;
  res.status(status).json(body);
}

export function validationError(fieldErrors) {
  const err = new Error("Validation failed");
  err.status = 400;
  err.fieldErrors = fieldErrors;
  return err;
}
