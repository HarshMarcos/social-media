import mongoose from "mongoose";

const connectdb = async () => {
  mongoose.set("strictQuery", true);

  try {
    const connecturi = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `Database connected successfully to host : ${connecturi.connection.host}`
    );
  } catch (error) {
    console.log(`Error message : ${error}`);
  }
};
export default connectdb;
