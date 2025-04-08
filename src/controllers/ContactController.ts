import { Response } from "express";
import Contact from "../models/ContactModel.js";
import { CustomRequest } from "../types/types.js";

export const getUserContacts = async (req: CustomRequest, res: Response) => {
  try {
    const { user } = req;
    const contacts = await Contact.find({ userId: user._id }).populate(
      "contactId"
    );
    console.log("got request");
    console.log(contacts);
    res.status(200).json({ contacts });
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
};

export const createContact = async (req: CustomRequest, res: Response) => {
  try {
    const { user } = req;
    const contactId = req.body.contactId;

    if (!contactId) {
      res.status(400).json({ message: "Contact ID is required" });
      return;
    }

    const existingContact = await Contact.findOne({
      contactId,
      userId: user._id,
    });
    if (existingContact) {
      res.status(400).json({ message: "Contact already exists" });
      return;
    }

    const contact = new Contact({
      contactId,
      userId: user._id,
    });
    await contact.save();
    res.status(201).json({
      message: "Contact created successfully",
      contact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
};

export const deleteContact = async (req: CustomRequest, res: Response) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findByIdAndDelete(contactId);
    if (!contact) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
};
