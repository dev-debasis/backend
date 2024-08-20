/**
 * Custom error class for API-specific errors.
 * Extends the built-in JavaScript Error class.
*/

class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);  // Call the constructor of the parent Error class with the error message.
        this.statusCode = statusCode;  // HTTP status code (e.g., 404, 500).
        this.message = message;  // A human-readable description of the error.
        this.errors = errors;  // Additional error details, such as validation errors.
        this.data = null;  // Placeholder for any additional data related to the error.
        this.success = false;  // Indicates that the API request was not successful.
    }
}

export { ApiError };
