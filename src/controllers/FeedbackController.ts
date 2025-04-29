// Importing the Response object from Express to handle HTTP responses
import { Response } from "express";

// Importing the Feedback model to interact with the feedback collection in the database
import Feedback from "../models/FeedbackModel.js";

// Importing a custom request type that includes additional properties (e.g., user)
import { CustomRequest } from "../types/types.js";

// Controller function to create a new feedback entry
export const createFeedback = async (req: CustomRequest, res: Response) => {
  try {
    // Extracting the user object from the request (assumes user is authenticated and added to the request)
    const { user } = req;

    // Creating a new feedback document with the user ID and request body data
    const feedback = new Feedback({
      userId: user._id, // Associating the feedback with the authenticated user
      ...req.body, // Spreading the rest of the feedback data from the request body
    });

    // Saving the feedback document to the database
    await feedback.save();

    // Sending a success response with the created feedback
    res.status(201).json({
      message: "Feedback created successfully",
      feedback,
    });
  } catch (error) {
    // Handling errors and sending a 500 status code with the error message
    res.status(500).json({ message: error.message });
    return;
  }
};

// Controller function to retrieve all feedback entries
export const getAllFeedbacks = async (req: CustomRequest, res: Response) => {
  try {
    // Fetching all feedback entries from the database and populating the "userId" field
    const feedbacks = await Feedback.find().populate("userId");

    // Sending the feedbacks as a JSON response with a 200 status code
    res.status(200).json({ feedbacks });
  } catch (error) {
    // Handling errors and sending a 500 status code with the error message
    res.status(500).json({ message: error.message });
    return;
  }
};
