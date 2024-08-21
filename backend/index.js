import dotenv from "dotenv";
import connectDB from "./config/DB.js";
import server from "./socket/socket.js";

dotenv.config();

connectDB()
  .then(() => {
    server.on("error", (error) => {
      console.log("app connection failed", error);
      throw error;
    });
    server.listen(process.env.PORT || 5000, () => {
      console.log(`server running at ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!!", err);
  });
