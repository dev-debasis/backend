/**
 * Higher-order function to handle asynchronous route handlers in Express.js.
 * This utility function ensures that any errors in asynchronous route handlers
 * are caught and passed to the next middleware.
 *
 * requestHandler - The asynchronous route handler function.
*/

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err));  // Pass any errors to the next middleware (typically an error handler).
    };
};

export { asyncHandler };
