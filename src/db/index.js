import mongoose from "mongoose"
import {DB_NAME} from "../constants.js"

// While connecting to DB always write with try-catch as error can occur in case of DB.
// write async function as DB is in another continent so it takes time to fetch
let connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB Connected !!! `);
        console.log(`\n DB HOST: ${connectionInstance.connection.host}`);
        
    }catch(error){
        console.error("MONGODB Connection Failed: ", error)
        process.exit(1)
    }
}

export default connectDB;