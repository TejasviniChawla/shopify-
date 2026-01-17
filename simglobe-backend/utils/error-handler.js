/**
 * Error Handler Middleware
 * Centralized error handling for the API
 */

/**
 * Custom API Error class
 */
class ApiError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, details) {
    return new ApiError(message, 400, details);
  }

  static unauthorized(message) {
    return new ApiError(message || 'Unauthorized', 401);
  }

  static forbidden(message) {
    return new ApiError(message || 'Forbidden', 403);
  }

  static notFound(message) {
    return new ApiError(message || 'Resource not found', 404);
  }

  static conflict(message) {
    return new ApiError(message || 'Conflict', 409);
  }

  static tooManyRequests(message) {
    return new ApiError(message || 'Too many requests', 429);
  }

  static internal(message) {
    return new ApiError(message || 'Internal server error', 500);
  }

  static serviceUnavailable(message) {
    return new ApiError(message || 'Service unavailable', 503);
  }
}

/**
 * Error handler middleware
 */
function errorHandler(err, req, res, next) {
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method
    });
  }

  // Handle ApiError instances
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        status: err.statusCode,
        details: err.details,
        timestamp: err.timestamp
      }
    });
  }

  // Handle Axios errors (from external API calls)
  if (err.isAxiosError) {
    const statusCode = err.response?.status || 502;
    const message = err.response?.data?.message || 'External service error';

    return res.status(statusCode).json({
      error: {
        message,
        status: statusCode,
        service: err.config?.url ? new URL(err.config.url).hostname : 'unknown',
        timestamp: new Date().toISOString()
      }
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: {
        message: 'Validation error',
        status: 400,
        details: err.details || err.message,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Handle JSON parse errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: {
        message: 'Invalid JSON in request body',
        status: 400,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message || 'Internal server error';

  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Async handler wrapper
 * Catches errors in async route handlers
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Not found handler
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      message: 'Endpoint not found',
      status: 404,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString()
    }
  });
}

module.exports = errorHandler;
module.exports.ApiError = ApiError;
module.exports.asyncHandler = asyncHandler;
module.exports.notFoundHandler = notFoundHandler;
