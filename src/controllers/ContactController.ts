// Importing the Response object from Express to handle HTTP responses
import { Response } from "express";

// Importing the Contact model to interact with the contacts collection in the database
import Contact from "../models/ContactModel.js";

// Importing a custom request type that includes additional properties (e.g., user)
import { CustomRequest } from "../types/types.js";

// Controller function to get all contacts for a specific user
export const getUserContacts = async (req: CustomRequest, res: Response) => {
  try {
    // Extracting the user object from the request (assumes user is authenticated and added to the request)
    const { user } = req;

    // Fetching all contacts associated with the user's ID and populating the "contactId" field
    const contacts = await Contact.find({ userId: user._id }).populate(
      "contactId"
    );

    // Logging the request and fetched contacts for debugging purposes
    console.log("got request");
    console.log(contacts);

    // Sending the contacts as a JSON response with a 200 status code
    res.status(200).json({ contacts });
  } catch (error) {
    // Handling errors and sending a 500 status code with the error message
    res.status(500).json({ message: error.message });
    return;
  }
};

// Controller function to create a new contact for a user
export const createContact = async (req: CustomRequest, res: Response) => {
  try {
    // Extracting the user object from the request
    const { user } = req;

    // Extracting the contact ID from the request body
    const contactId = req.body.contactId;

    // Validating that the contact ID is provided
    if (!contactId) {
      res.status(400).json({ message: "Contact ID is required" });
      return;
    }

    // Checking if the contact already exists for the user
    const existingContact = await Contact.findOne({
      contactId,
      userId: user._id,
    });
    if (existingContact) {
      res.status(400).json({ message: "Contact already exists" });
      return;
    }

    // Creating a new contact document
    const contact = new Contact({
      contactId,
      userId: user._id,
    });

    // Saving the new contact to the database
    await contact.save();

    // Sending a success response with the created contact
    res.status(201).json({
      message: "Contact created successfully",
      contact,
    });
  } catch (error) {
    // Handling errors and sending a 500 status code with the error message
    res.status(500).json({ message: error.message });
    return;
  }
};

// Controller function to delete a contact by its ID
export const deleteContact = async (req: CustomRequest, res: Response) => {
  try {
    // Extracting the contact ID from the request parameters
    const { contactId } = req.params;

    // Finding and deleting the contact by its ID
    const contact = await Contact.findByIdAndDelete(contactId);

    // If the contact is not found, send a 404 response
    if (!contact) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }

    // Sending a success response after deletion
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    // Handling errors and sending a 500 status code with the error message
    res.status(500).json({ message: error.message });
    return;
  }
};
