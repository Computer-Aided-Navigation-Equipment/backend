import { Response } from "express";
import { CustomRequest } from "../types/types.js";
import Counter from "../models/CounterModel.js";
import { s3 } from "../config/multerConfiguration.js";
import Location from "../models/LocationModel.js";

export const createLocation = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { user } = req;

    const location = new Location({
      ...req.body,
      userId: user._id,
    });
    await location.save();
    res.status(201).json({
      message: "Location created successfully",
      location,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
};

export const getUserLocations = async (req: CustomRequest, res: Response) => {
  try {
    const { user } = req;
    const locations = await Location.find({ userId: user._id });
    res.status(200).json({ locations });
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
};

export const deleteLocation = async (req: CustomRequest, res: Response) => {
  try {
    const { locationId } = req.params;
    const location = await Location.findByIdAndDelete(locationId);
    if (!location) {
      res.status(404).json({ message: "Location not found" });
      return;
    }

    res.status(200).json({ message: "Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
};
