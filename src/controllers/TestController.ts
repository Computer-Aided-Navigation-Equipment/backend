// Importing necessary modules and models
import { Response } from "express";
import { CustomRequest } from "../types/types.js";
import Counter from "../models/CounterModel.js";  // Counter model (unused in this code snippet)
import { s3 } from "../config/multerConfiguration.js";  // Multer configuration for file uploads (unused here)
import Location from "../models/LocationModel.js";  // Location model

// Controller to create a new location
export const createLocation = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { user } = req;  // Getting user data from the request

    // Creating a new Location document with the user ID and the data from the request body
    const location = new Location({
      ...req.body,  // Spreading the rest of the request body properties to the location
      userId: user._id,  // Associating the location with the current user
    });

    // Saving the new location to the database
    await location.save();

    // Responding with a success message and the created location data
    res.status(201).json({
      message: "Location created successfully",
      location,
    });
  } catch (error) {
    // Handling errors by sending a 500 status and the error message
    res.status(500).json({ message: error.message });
    return;
  }
};

// Controller to get all locations for the current user
export const getUserLocations = async (req: CustomRequest, res: Response) => {
  try {
    const { user } = req;  // Getting user data from the request

    // Fetching all locations for the current user
    const locations = await Location.find({ userId: user._id });

    // Responding with the list of locations
    res.status(200).json({ locations });
  } catch (error) {
    // Handling errors by sending a 500 status and the error message
    res.status(500).json({ message: error.message });
    return;
  }
};

// Controller to delete a location by locationId
export const deleteLocation = async (req: CustomRequest, res: Response) => {
  try {
    const { locationId } = req.params;  // Extracting locationId from the request parameters

    // Finding and deleting the location by its ID
    const location = await Location.findByIdAndDelete(locationId);

    // If the location doesn't exist, respond with a 404 error
    if (!location) {
      res.status(404).json({ message: "Location not found" });
      return;
    }

    // Responding with a success message after deletion
    res.status(200).json({ message: "Location deleted successfully" });
  } catch (error) {
    // Handling errors by sending a 500 status and the error message
    res.status(500).json({ message: error.message });
    return;
  }
};
