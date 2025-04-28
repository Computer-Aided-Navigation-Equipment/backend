import mongoose, { ConnectOptions } from "mongoose";

// Database connection options for mongoose
const options: ConnectOptions = {
  maxPoolSize: 20, // Limit the number of concurrent connections to the database to 20
};

// Function to attempt the database connection with retry logic
const waitForConnection = async () => {
  const maxRetries = 10; // Maximum number of retries allowed for connecting to the database
  let retryCount = 0;    // Counter to track the number of retries attempted

  // While the database connection is not established (readyState !== 1) 
  // and the retry count is less than the max retries
  while (mongoose.connection.readyState !== 1 && retryCount < maxRetries) {
    console.log("Database not connected. Retrying...");
    
    try {
      // Attempt to connect to the database using the provided URI and options
      await mongoose.connect(process.env.DBURI, options);
      console.log("Database reconnected successfully.");
      return; // Exit the function if the connection is successful
    } catch (err) {
      retryCount++; // Increment the retry count after each failed attempt
      console.error("Database connection failed. Retrying...");

      // Wait for 1 second before attempting to reconnect
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // If the retry count exceeds the maximum, throw an error
  if (retryCount >= maxRetries) {
    throw new Error("Database connection failed after multiple attempts");
  }
};

// Middleware function to ensure the database connection before handling requests
const dbConnectionMiddleware = async (req: any, res: any, next: any) => {
  // Wait for the database to connect (with retry mechanism) before proceeding
  await waitForConnection();

  // Log the connection state before calling the API
  console.log(
    "Connection state before API calling:",
    mongoose.connection.readyState
  );

  // Proceed to the next middleware or route handler
  next();
};

// Export the middleware so it can be used in other parts of the application
export default dbConnectionMiddleware;
