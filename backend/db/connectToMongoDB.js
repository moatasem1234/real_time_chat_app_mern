import mongoose from "mongoose";
import dotenv from "dotenv"


dotenv.config()


const DB_URL = process.env.DB_URL

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(DB_URL)
        console.log('connecting to mongodb successfully')
    }
    catch (error) {
        console.log('error in connecting mongodb', error)

    }

}
export default connectToMongoDB
