// require('dotenv').config({path: "./env"})
import dotenv from "dotenv"
import connectDB from "./db/index.js"
const PORT = process.env.PORT || 4000
dotenv.config({
  path: "./env"
})

connectDB()  // connectDB is an async function and async function always returns a promise that's why we are using then and catch method.
.then(() => {
  app.listen(PORT, () => {
    console.log(`App is listening on port: ${PORT}`)
  })
})
.catch("error", () => {
  console.log("DataBase Connection failed: ", error)
})