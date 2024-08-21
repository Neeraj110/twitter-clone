import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`\nMongoDB Connected: ${conn.connection.host}\n`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
