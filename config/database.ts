import config from "config";
import { connect } from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI: string = config.get("mongoURI");
    await connect(mongoURI, {
      serverSelectionTimeoutMS: 30000, // Defaults to 30000 (30 seconds)
  });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    //Exit process with failure
    //process.exit(1);
  }
};  
export default connectDB;
