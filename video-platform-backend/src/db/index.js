import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        
        // Logs the host where MongoDB is running
        // Useful in production or staging to know
        // which database server the app is connected to.
        console.log(`\n MongoDB connected !! DB HOST: ${
            connectionInstance.connection.host
        }`);
        return connectionInstance
    } catch (error) {
        console.log("MONGODB connection FAILED: ", error);

        // stops the Node.js process
        process.exit(1)
    }
}

export default connectDB