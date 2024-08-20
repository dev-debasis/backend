/**
 * Higher-order function to handle asynchronous route handlers in Express.js.
 * This utility function ensures that any errors in asynchronous route handlers
 * are caught and passed to the next middleware.
 *
 * requestHandler - The asynchronous route handler function.
 * @returns {Function} - A new function that wraps the original handler with error handling.
*/

const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err));  // Pass any errors to the next middleware (typically an error handler).
    };
};

export { asyncHandler };
