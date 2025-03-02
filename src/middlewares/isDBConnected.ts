import mongoose, { ConnectOptions } from "mongoose";

const options: ConnectOptions = {
  maxPoolSize: 20,
};
const waitForConnection = async () => {
  const maxRetries = 10;
  let retryCount = 0;

  while (mongoose.connection.readyState !== 1 && retryCount < maxRetries) {
    console.log("Database not connected. Retrying...");
    try {
      await mongoose.connect(process.env.DBURI, options);
      console.log("Database reconnected successfully.");
      return;
    } catch (err) {
      retryCount++;
      console.error("Database connection failed. Retrying...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  if (retryCount >= maxRetries) {
    throw new Error("Database connection failed after multiple attempts");
  }
};

const dbConnectionMiddleware = async (req: any, res: any, next: any) => {
  await waitForConnection();

  console.log(
    "Connection state before API calling:",
    mongoose.connection.readyState
  );

  next();
};

export default dbConnectionMiddleware;
