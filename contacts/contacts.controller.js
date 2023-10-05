const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("./contacts.service");

const listContactsHandler = async (req, res, next) => {
  try {
    const users = await listContacts();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getContactByIdHandler = async (req, res, next) => {
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
};

const addContactHandler = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const newUser = await addContact({ name, email, phone });
    res.status(201).json({ newUser });
  } catch (error) {
    console.error("Error adding contact:", error);
  }
};

const deleteHandler = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    await removeContact(contactId);
    res.status(200).json({ message: "Contact deleted." });
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
};

const updateHandler = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    await updateContact(contactId, req.body);
    res.status(200).json({ message: "Contact updated." });
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
};

const favoriteHandler = async (req, res, next) => {
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
};

module.exports = {
  listContactsHandler,
  getContactByIdHandler,
  addContactHandler,
  deleteHandler,
  updateHandler,
  favoriteHandler,
};
