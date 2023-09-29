const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
  updateStatusContact,
} = require("./contacts.service.js");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await listContacts();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const getById = await getContactById(contactId);
    if (!getById) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ getById });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const { error } = schema.validate({ name, email, phone });
    if (error) {
      return res.status(400).json({ message: "Missing required name - field" });
    }
    const newUser = await addContact({ name, email, phone });
    res.status(201).json({ newUser });
  } catch (error) {
    console.error("Error adding contact:", error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    await removeContact(contactId);
    res.status(200).json({ message: "Contact deleted." });
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, email, phone } = req.body;
    const { error } = schema.validate({ name, email, phone });
    if (error) {
      return res.status(400).json();
    }
    await updateContact(contactId, req.body);
    res.status(200).json({ message: "Contact updated." });
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  if (typeof favorite === "undefined") {
    return res.status(400).json({ message: "Missing field favorite" });
  }
  try {
    const updatedStatus = await updateStatusContact(contactId, favorite);
    if (!updatedStatus) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updatedStatus);
  } catch (error) {
    console.error("Error updating contact:", error.message);
  }
});

module.exports = router;
