export const notFound = (req, res, next) => {
  res.status(404).json({ message: "Route not found" });
};

export const errorHandler = (err, req, res, next) => {
  // Zod formatted errors
  if (err?.name === "ZodError" || err?.issues) {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.issues ?? err.format?.()
    });
  }

  const status = err.status || 500;
  const message = err.message || "Server error";
  res.status(status).json({ message });
};
