const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("./contacts.service");

const { Contact } = require("./contacts.model");

const listContactsHandler = async (req, res, next) => {
  try {
    const userId = req.user;
    const users = await listContacts(userId);
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getContactByIdHandler = async (req, res, next) => {
  try {
    const userId = req.user;
    const { contactId } = req.params;
    const getById = await getContactById(contactId, userId);
    if (!getById) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ getById });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addContactHandler = async (req, res, next) => {
  try {
    const userId = req.user;
    const { name, email, phone } = req.body;
    const newUser = await addContact({ name, email, phone }, userId);
    return res.status(201).json({ newUser });
  } catch (error) {
    console.error("Error adding contact:", error);
  }
};

const deleteHandler = async (req, res, next) => {
  try {
    const userId = req.user;
    const { contactId } = req.params;
    const contactToDelete = await Contact.findOne({
      _id: contactId,
      owner: userId,
    });
    if (contactToDelete) {
      await removeContact(contactId, userId);
      res.status(200).json({ message: "Contact deleted." });
    }
    return res.status(404).json({ message: "Not found" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateHandler = async (req, res, next) => {
  try {
    const userId = req.user;
    const { contactId } = req.params;
    const contactToUpdate = await Contact.findOne({
      _id: contactId,
      owner: userId,
    });
    if (contactToUpdate) {
      await updateContact(contactId, req.body);
      res.status(200).json({ message: "Contact updated." });
    }
    return res.status(404).json({ message: "Not found" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const favoriteHandler = async (req, res, next) => {
  const userId = req.user;
  const { contactId } = req.params;
  const { favorite } = req.body;
  const contactToUpdate = await Contact.findOne({
    _id: contactId,
    owner: userId,
  });
  try {
    if (contactToUpdate) {
      if (typeof favorite === "undefined") {
        return res.status(400).json({ message: "Missing field favorite" });
      }
      const updatedStatus = await updateStatusContact(contactId, favorite);
      if (!updatedStatus) {
        return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json(updatedStatus);
    }
    return res.status(404).json({ message: "Not found" });
  } catch (error) {
    console.error("Error updating contact:", error.message);
  }
};

module.exports = {
  listContactsHandler,
  getContactByIdHandler,
  addContactHandler,
  deleteHandler,
  updateHandler,
  favoriteHandler,
};
