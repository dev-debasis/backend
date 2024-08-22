// Import the necessary modules
import express, { urlencoded } from "express";
import cors from "cors"; 
import cookieParser from "cookie-parser"; 

const app = express();

// Enable CORS with specific configurations
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Allow requests only from the specified origin, defined in environment variables
    credentials: true // Allow cookies and other credentials to be included in cross-origin requests
}));

// Middleware to parse incoming JSON requests with a size limit
app.use(express.json({ limit: "20kb" }));

// Middleware to parse URL-encoded data (typically from form submissions) with a size limit
app.use(urlencoded({ extended: true, limit: "20kb" }));

// Serve static files from the "public" directory
app.use(express.static("public"));

// Middleware for parsing cookies attached to client requests
app.use(cookieParser());


// Import Router
import userRouter from "./routes/user.router.js"


// Declaring the Router
app.use("/api/v1/users", userRouter)


export { app };
