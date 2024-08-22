// require('dotenv').config({path: "./env"})
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import {app} from "./app.js"

dotenv.config({
  path: "./env"
})

const PORT = process.env.PORT || 3000

connectDB()  // connectDB is an async function and async function always returns a promise that's why we are using then and catch method.
.then(() => {
  app.listen(PORT, () => {
    console.log(`App is listening on http://localhost:${process.env.PORT}`)
  })
})
.catch("error", () => {
  console.log("DataBase Connection failed: ", error)
})