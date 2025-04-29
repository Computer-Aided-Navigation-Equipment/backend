// Importing necessary modules and models
import { Response } from "express";
import { CustomRequest } from "../types/types.js";
import Counter from "../models/CounterModel.js";
import Location from "../models/LocationModel.js";

// Controller to create a new location
export const createLocation = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { user } = req;

    // Checking if the location data is provided in the request body
    if (!req.body.location) {
      res.status(400).json({ message: "Title and location are required" });
      return;
    }

    // Incrementing the counter for location IDs using Counter model
    const counter = await Counter.findOneAndUpdate(
      { id: "location" },
      { $inc: { seq: 1 } }, // Incrementing the sequence number for the location ID
      { new: true, upsert: true } // Create counter if not found
    );

    // If no title is provided, default to "Location {counter.seq}"
    let title = req.body.title || `Location ${counter.seq}`;

    // Creating a new Location document with the provided data and the auto-generated ID
    const location = new Location({
      ...req.body, // Spreading the rest of the request body properties
      id: counter.seq, // Setting the location ID to the incremented counter
      title: title, // Setting the title (either provided or defaulted)
      userId: user._id, // Associating the location with the current user
    });

    // Saving the new location to the database
    await location.save();

    // Responding with a success message and the created location data
    res.status(201).json({
      message: "Location created successfully",
      location,
    });
  } catch (error) {
    // Handling any errors by sending a 500 status with the error message
    res.status(500).json({ message: error.message });
    return;
  }
};

// Controller to get all locations of the current user
export const getUserLocations = async (req: CustomRequest, res: Response) => {
  try {
    const { user } = req;

    // Fetching locations associated with the current user
    const locations = await Location.find({ userId: user._id });

    // Responding with the list of locations
    res.status(200).json({ locations });
  } catch (error) {
    // Handling any errors by sending a 500 status with the error message
    res.status(500).json({ message: error.message });
    return;
  }
};

// Controller to delete a location by locationId
export const deleteLocation = async (req: CustomRequest, res: Response) => {
  try {
    const { locationId } = req.params;

    // Finding and deleting the location by ID
    const location = await Location.findByIdAndDelete(locationId);
    
    // If the location is not found, return a 404 error
    if (!location) {
      res.status(404).json({ message: "Location not found" });
      return;
    }

    // Responding with a success message upon successful deletion
    res.status(200).json({ message: "Location deleted successfully" });
  } catch (error) {
    // Handling any errors by sending a 500 status with the error message
    res.status(500).json({ message: error.message });
    return;
  }
};
